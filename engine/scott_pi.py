import pandas as pd
import sys
import argparse

# Assumptions about the input data file: 
#   1. The data file contains headers (e.g., C1, C2)
#   2. There is an index column.
#   3. There are exactly 2 coders and each coder occupies one column.
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
    if num_coders > 2:
        print("The number of raters should be exactly 2.")
        sys.stdout.flush()
        exit(1)
    
    pi = 0

    # calculate weighted ovserved_agreement
    if metric == 'nominal':
        weighted = df.apply(lambda x: 1 if x[1] == x[2] else 0, 
                axis=1)
    else:
        weighted = df.apply(lambda x: 1 - abs(weights[x[1]] - 
                    weights[x[2]]) / max_diff, axis=1)
    observed_agreement = weighted.sum() / total
            
    # calculate weighted agreement_by_chance
    agreement_by_chance = 0
    coder1 = dict(df.iloc[:, 1].value_counts()) 
    coder2 = dict(df.iloc[:, 2].value_counts())
    if metric == 'nominal':    
        for k in coder1:
            if k in coder2:
                agreement_by_chance += (coder1[k] + coder2[k]) ** 2
    else:
        for k in coder1:
            for t in coder2:
                weight = 1 - abs(weights[k] - weights[t]) \
                    / max_diff
                a, b = 0, 0
                if k in coder2:
                    a = coder2[k]
                if t in coder1:
                    b = coder1[t]
                agreement_by_chance += weight * (coder1[k] + a) * \
                (coder2[t] + b)
            
    agreement_by_chance /= (2 * total) ** 2
    pi += (observed_agreement - agreement_by_chance) \
        / (1 - agreement_by_chance)

    return pi

# try:
#     result = main()
#     print(result)
#     sys.stdout.flush()
# except:
#     print('Error: ', sys.exc_info()[1])
#     sys.stdout.flush()
#     exit(1)


    