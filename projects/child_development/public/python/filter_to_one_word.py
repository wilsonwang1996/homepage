import pandas as pd
import re

df = pd.read_csv('../data/word_data_merged.csv')
norepeats = df.drop_duplicates(subset='word')
norepeats.to_csv("../data/word_data_no_repeats.csv", index=None)
