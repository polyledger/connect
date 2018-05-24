import dateutil.parser
from datetime import date, timedelta
from api.backtest import Portfolio
from api.models import Price


def get_chart_data(ledger, period):
    days = {'7D': 7, '1M': 30, '3M': 90, '6M': 182, '1Y': 364}
    end = date.today()
    start = end - timedelta(days=days[period])

    portfolio = Portfolio(start=start)
    cost_basis = 0
    cost_basis_period = 0
    profit = 0
    profit_period = 0
    for entry in ledger:
        transaction_type = entry['transaction_type']
        time = dateutil.parser.parse(entry['time'])

        if transaction_type == 'exchange_deposit':
            asset = entry['size']['symbol']
            amount = abs(float(entry['size']['size']))
            portfolio.add(asset, amount, time)
        elif transaction_type == 'exchange_withdrawal':
            asset = entry['size']['symbol']
            amount = abs(float(entry['size']['size']))
            portfolio.remove(asset, amount, time)
        elif transaction_type == 'buy':
            amount = abs(float(entry['quote']['size']))
            quote = entry['quote']['symbol']
            if quote == 'USD':
                cost_basis += amount
                if time.date() > start:
                    cost_basis_period += amount
            else:
                portfolio.remove(quote, amount, time)
            base = entry['base']['symbol']
            amount = abs(float(entry['base']['size']))
            portfolio.add(base, amount, time)
        elif transaction_type == 'sell':
            base = entry['base']['symbol']
            amount = abs(float(entry['base']['size']))
            portfolio.remove(base, amount, time)
            quote = entry['quote']['symbol']
            amount = abs(float(entry['quote']['size']))
            if quote == 'USD':
                profit += amount
                if time.date() > start:
                    profit_period += amount
            portfolio.add(quote, amount, time)
        elif transaction_type == 'address_withdrawal':
            asset = entry['size']['symbol']
            amount = abs(float(entry['size']['size']))
            fee = float(entry['network_fee']['size'])
            amount += fee
            portfolio.remove(asset, amount, time)
        elif transaction_type == 'address_deposit':
            asset = entry['size']['symbol']
            amount = abs(float(entry['size']['size']))
            fee = float(entry['network_fee']['size'])
            amount -= fee
            portfolio.add(asset, amount, time)
        elif transaction_type == 'internal_address_withdrawal':
            asset = entry['size']['symbol']
            amount = abs(float(entry['size']['size']))
            portfolio.remove(asset, amount, time)
        elif transaction_type == 'internal_address_deposit':
            asset = entry['size']['symbol']
            amount = abs(float(entry['size']['size']))
            portfolio.add(asset, amount, time)

    # Don't include USD in portfolio valuation
    portfolio.remove('USD', portfolio.assets['USD'], date.today())
    historic_value = portfolio.historic_value(start=start, end=end, freq='D')
    start_value = round(historic_value[0][1], 2)
    market_value = round(historic_value[-1][1], 2)
    past_period_return = round(market_value - start_value - cost_basis_period + profit_period, 2)
    all_time_return = market_value - cost_basis + profit

    try:
        past_period_return_pct = float(past_period_return) / float(start_value + cost_basis_period)
    except ZeroDivisionError:
        past_period_return_pct = 0

    try:
        all_time_return_pct = (float(all_time_return) / float(cost_basis))
    except ZeroDivisionError:
        all_time_return_pct = 0

    series = [{'name': 'Portfolio', 'data': historic_value}]

    return {
        'series': series,
        'market_value': market_value,
        'past_period_return': past_period_return,
        'past_period_return_pct': past_period_return_pct,
        'all_time_return': all_time_return,
        'all_time_return_pct': all_time_return_pct
    }


def get_asset_data(balances):
    positions = []
    for position in balances:
        if float(position['asset']['size']) > 0:
            asset = position['asset']['symbol']
            try:
                price = Price.objects.get(date=date.today(), asset=asset).close
            except Price.DoesNotExist:
                price = 0
            quantity = float(position['asset']['size'])
            market_value = price * quantity
            position['asset']['price'] = price
            position['asset']['market_value'] = market_value
            positions.append(position)
    return positions
