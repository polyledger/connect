import pandas as pd
from api.models import Coin, Price

def prices_to_dataframe(queryset=None, columns=None):
    coins = Coin.objects.all()
    symbols = sorted(list(map(lambda c: c.symbol, coins)))

    if columns is None:
        columns = list(symbols).append('date')

    if queryset is None:
        excluded = {}

        for symbol in symbols:
            excluded[symbol + '__isnull'] = False

        queryset = Price.objects.filter(**excluded, date__gte='2017-10-01') \
                                .order_by('-date') \
                                .values('date', *symbols)

    df = pd.DataFrame(data=list(queryset), columns=columns)
    df['date'] = df['date'].dt.date
    df.set_index('date', inplace=True)
    df.index = pd.to_datetime(df.index)
    return df
