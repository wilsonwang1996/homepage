import pandas as pd
from nltk.corpus import stopwords
from textblob import TextBlob
from textblob import Word


def prepossess(input_path, output_path):
    def filter_func(x):
        if len(x.split()) > 0:
            return True
        else:
            return False

    text = open(input_path, "r").read()
    lines = text.split("\n")
    lines = list(filter(filter_func, lines))
    df = pd.DataFrame()
    df["lines"] = lines
    # to lower case
    df['lines'] = df['lines'].apply(lambda x: " ".join(x.lower() for x in x.split()))
    # remove punctuation
    df['lines'] = df['lines'].str.replace('[^\w\s]', '')
    # remove stopword
    stop = stopwords.words('english')
    df['lines'] = df['lines'].apply(lambda x: " ".join(x for x in x.split() if x not in stop and not x.isdigit()))
    df['lines'] = df['lines'].apply(lambda x: " ".join([Word(word).lemmatize() for word in x.split()]))
    df.to_csv(output_path, index=False)


prepossess("data/englishfairytales.txt", "data/prepossessed/englishfairytales.txt")
prepossess("data/russianfairytales.txt", "data/prepossessed/russianfairytales.txt")
prepossess("data/indianfairytales.txt", "data/prepossessed/indianfairytales.txt")
