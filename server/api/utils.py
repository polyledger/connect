import pandas as pd
from datetime import date, timedelta
from api.models import Coin, Price


def prices_to_dataframe(queryset=None, symbols=None):

    if symbols is None:
        symbols = sorted(list(map(lambda c: c.symbol, Coin.objects.all())))

    columns = list(symbols).append('timestamp')

    if queryset is None:
        timestamp__gte = date.today() - timedelta(days=365)
        queryset = Price.objects.filter(timestamp__gte=timestamp__gte) \
                                .order_by('-timestamp') \
                                .values('timestamp', *symbols)

    df = pd.DataFrame(data=list(queryset), columns=columns)
    df['timestamp'] = df['timestamp'].dt.date
    df.set_index('timestamp', inplace=True)
    df.index = pd.to_datetime(df.index)
    return df
