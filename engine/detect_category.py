import pandas as pd
import sys

categories = sys.argv[1]
df = pd.read_csv(categories, header=None, names=['c'])
print(', '.join(df['c'].tolist()))

sys.stdout.flush()