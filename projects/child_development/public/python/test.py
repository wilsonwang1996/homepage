import pandas as pd
import re


# A method to figure out if a word is of unit length with no special characters in it
def pure_word(word):
    if re.match("^\w+$", str(word)):
        return True
    return False


# A method to merge file a and file b based on the column "word"
def merge_files(file_a_dir, file_b_dir, output_dir):
    data_sent = pd.read_csv(file_a_dir)
    data = pd.read_csv(file_b_dir)
    new_df = pd.merge(data, data_sent, on='word', how='inner')
    new_df.to_csv(output_dir, index=None)


# A method to clean up a file based on column "word"
def clean_up_file(file_dir):
    data = pd.read_csv(file_dir)
    data = data.dropna().drop_duplicates("word")
    data = data[data["word"].map(pure_word)]
    data.to_csv(file_dir, index=False)
