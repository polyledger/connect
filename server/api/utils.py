import pandas as pd

def queryset_to_dataframe(queryset, columns):
    df = pd.DataFrame(data=list(queryset), columns=columns)
    df['date'] = df['date'].dt.date
    df.set_index('date', inplace=True)
    df.index = pd.to_datetime(df.index)
    return df
