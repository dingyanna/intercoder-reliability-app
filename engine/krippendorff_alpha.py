import pandas as pd
import krippendorff
import numpy as np
import sys

# Assumptions about the input data file: 
#   1. The data file contains headers (e.g., C1, C2)
#   2. There is an index column.
#   3. There are at least 2 coders and each coder occupies one column.
#
# Assumptions about the input weights file:
#   1. There are exactly two columns with the first one being the categories and
#      the second one being the weights. 
#   2. There are no headers in this file.

def main(data, categories, metric, weights_file):
    
    df2 = pd.read_csv(categories, header=None, names=["c"], sep=",")

    df2['c'] = df2.apply(lambda x: str(x['c']).strip(), axis=1)
    all_categories = df2.c.to_list()
    
    df = pd.read_csv(data)
    reliability_data = []
    if metric == 'ordinal':
        df1 = pd.read_csv(weights_file, sep=",\s", header=None, 
            names=["c", "w"], engine="python")
        weights = dict(zip(df1.c, df1.w))
        for i in range(1, len(df.columns)):
            df['isnan'] = df.iloc[:, i].isna()
            temp = df.apply(lambda x: np.nan\
                    if x['isnan'] or (str(x[i]).strip() not in all_categories)\
                    else weights[x[i]], axis=1)
            reliability_data.append(temp.to_list())
    else:
        for i in range(1, len(df.columns)):
            df['isnan'] = df.iloc[:, i].isna()
            temp = df.apply(lambda x: np.nan\
                    if x['isnan'] or (str(x[i]).strip() not in all_categories)\
                    else all_categories.index(str(x[i]).strip()) + 1, axis=1)
            reliability_data.append(temp.to_list())
    
    return krippendorff.alpha(reliability_data=reliability_data, 
                       level_of_measurement=metric)

# try:
#     result = main()
#     print(result)
#     sys.stdout.flush()
# except:
#     print('Error: ', sys.exc_info()[1])
#     sys.stdout.flush()
#     exit(1)
    
    