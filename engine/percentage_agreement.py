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

    
    if metric == 'ordinal':
        df1 = pd.read_csv(weights_file, sep=",\s", header=None, 
                names=["c", "w"], engine="python")
        max_diff = df1.w.max() - df1.w.min()
        weights = dict(zip(df1.c, df1.w))


    df = pd.read_csv(data)
    total = len(df) 
    if total == 0:
        print(0)
        sys.stdout.flush()
        exit(0) 
    num_coders = len(df.columns) - 1

    agreement = 0    
    for i in range(1, num_coders):
        for j in range(i + 1, num_coders + 1):
            # calculate weighted ovserved_agreement
            if metric == 'nominal':
                weighted = df.apply(lambda x: 1 if x[i] == x[j] else 0, 
                        axis=1)
            else:
                weighted = df.apply(lambda x: 1 - abs(weights[x[i]] - 
                            weights[x[j]]) / max_diff, axis=1)
            agreement += weighted.sum() / total
            
    result = agreement / (num_coders * (num_coders - 1) / 2)
    return result

# try:
#     result = main()
#     print(result)
#     sys.stdout.flush()
# except:
#     print('Error: ', sys.exc_info()[1])
#     sys.stdout.flush()
#     exit(1)
    
    
    