import pandas as pd
import sys

categories = sys.argv[1]
df = pd.read_csv(categories, header=None, names=["c", "w"], 
    sep=",\s", dtype=object, engine="python")
mylist = df.values.tolist()
mylist1 = []
for i in mylist:
    item = ':'.join(i)
    mylist1.append(item)
message = ','.join(mylist1)

print(message)

sys.stdout.flush()