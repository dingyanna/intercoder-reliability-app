import pandas as pd
import sys

data = sys.argv[1]
df = pd.read_csv(data)
num_coders = len(df.columns) - 1 
total = len(df) 
print(num_coders, total)
sys.stdout.flush()