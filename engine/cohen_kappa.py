import pandas as pd
import sys

# Assumptions about the input data file: 
#   1. The data file contains headers (e.g., C1, C2)
#   2. There is an index column.
#   3. There are at least 2 coders and each coder occupies one column.
    

def main(data):
    
    df = pd.read_csv(data)
    total = len(df) 
    if total == 0:
        print(0)
        exit(0)
    num_coders = len(df.columns) - 1 

    sum_kappa = 0    
    for i in range(1, num_coders):
        for j in range(i + 1, num_coders + 1):
            # calculate observed_agreement
            weighted = df.apply(lambda x: 1 if x[i] == x[j] else 0, 
                        axis=1)
            observed_agreement = weighted.sum() / total
            
            # calculate agreement_by_chance.
            agreement_by_chance = 0
            coder1 = dict(df.iloc[:, i].value_counts()) 
            coder2 = dict(df.iloc[:, j].value_counts())
            for category in coder1:
                if category in coder2: 
                    agreement_by_chance += (coder1[category] * coder2[category]) \
                    / (total * total)
            sum_kappa += (observed_agreement - agreement_by_chance) \
                / (1 - agreement_by_chance)
        
    kappa = sum_kappa / (num_coders * (num_coders - 1) / 2)
    return kappa

 
# try:
#     result = main()
#     print(result)
#     sys.stdout.flush()
# except:
#     print('Error: ', sys.exc_info())
#     sys.stdout.flush()
#     exit(1)
