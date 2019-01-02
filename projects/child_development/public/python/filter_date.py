import pandas as pd

df = pd.read_csv("../data/word_data_merged.csv")
df.sample(1000).to_csv("../data/word_data_merged_short.csv", index=False)
