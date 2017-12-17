import pandas as pd
from datetime import date, timedelta
from api.models import Coin, Price

def prices_to_dataframe(queryset=None, coins=None):

    if coins is None:
        coins = Coin.objects.all()

    symbols = sorted(list(map(lambda c: c.symbol, coins)))
    columns = list(symbols).append('date')

    if queryset is None:
        date__gte = date.today() - timedelta(days=365)
        queryset = Price.objects.filter(date__gte=date__gte) \
                                .order_by('-date') \
                                .values('date', *symbols)

    df = pd.DataFrame(data=list(queryset), columns=columns)
    df['date'] = df['date'].dt.date
    df.set_index('date', inplace=True)
    df.index = pd.to_datetime(df.index)
    return df
