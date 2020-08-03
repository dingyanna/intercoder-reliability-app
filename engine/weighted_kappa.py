import pandas as pd
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

def main(data, weights_file):
    """
    Return the weighted cohen's kappa given file data and predefined weights.
    """
    df = pd.read_csv(data)
    df1 = pd.read_csv(weights_file, sep=",\s", header=None, names=["c", "w"], 
        engine="python")
    
    total = len(df) 
    if total == 0:
        exit(0)
    num_coders = len(df.columns) - 1
    
    max_diff = df1.w.max() - df1.w.min()
    weights = dict(zip(df1.c, df1.w))
    
    sum_kappa = 0    
    for i in range(1, num_coders):
        for j in range(i + 1, num_coders + 1):
            # calculate weighted ovserved_agreement
            df['Weight'] = df.apply(lambda x: 1 - abs(weights[x[i]] - 
                            weights[x[j]]) / max_diff, axis=1)
            observed_agreement = df['Weight'].sum() / total
            
            # calculate weighted agreement_by_chance
            agreement_by_chance = 0
            coder1 = dict(df.iloc[:, i].value_counts()) 
            coder2 = dict(df.iloc[:, j].value_counts())
            for k in coder1:
                for t in coder2:
                    weight = 1 - (abs(weights[k] - weights[t]) \
                        / max_diff) 
                    agreement_by_chance += (weight * (coder1[k] * coder2[t]) 
                    / (total * total))
            sum_kappa += (observed_agreement - agreement_by_chance) \
                / (1 - agreement_by_chance)
                
    kappa = sum_kappa / (num_coders * (num_coders - 1) / 2)
    return kappa



# try:
#     result = main()
#     print(result)
#     sys.stdout.flush()
# except:
#     print('Error: ', sys.exc_info()[1])
#     sys.stdout.flush()
#     exit(1)
