'''
http://www.ultravioletanalytics.com/blog/tf-idf-basics-with-pandas-scikit-learn
https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
https://www.analyticsvidhya.com/blog/2018/02/the-different-methods-deal-text-data-predictive-python/
'''
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
import nltk
from textblob import TextBlob


def filter_func(x):
    if len(x.split()) > 0:
        return True
    else:
        return False


def avg_word(sentence):
    words = sentence.split()
    words = list(filter(None, words))
    return sum(len(word) for word in words) / len(words)


def tfidf_analysis(input_path, output_path):
    text = open(input_path, "r").read()
    lines = text.split("\n")
    lines = list(filter(filter_func, lines))
    df = pd.DataFrame()
    df["lines"] = lines
    # get number of words
    df['word_count'] = df['lines'].apply(lambda x: len(str(x).split(" ")))
    # get number of characters
    df['char_count'] = df['lines'].str.len()
    # get average word length
    df['avg_word'] = df['lines'].apply(lambda x: avg_word(x))
    df = df[df['avg_word'] <= 14]

    '''
    tf-idf analysis
    '''
    cvec = CountVectorizer(stop_words='english', min_df=1, max_df=.5, ngram_range=(1, 1))
    cvec.fit(df.lines)
    cvec_counts = cvec.transform(df.lines)
    transformer = TfidfTransformer()
    transformed_weights = transformer.fit_transform(cvec_counts)
    weights = np.asarray(transformed_weights.mean(axis=0)).ravel().tolist()
    weights_df = pd.DataFrame({'term': cvec.get_feature_names(), 'weight': weights})
    weights_df = weights_df.sort_values(by='weight', ascending=False)
    weights_df['tagged'] = weights_df["term"].apply(lambda x: nltk.pos_tag([x])[0][1])
    weights_df = weights_df[weights_df["tagged"].str.contains("^NN$")].reset_index(drop=True)
    print(weights_df.head(50))
    weights_df.head(50).to_csv(output_path, index=False)


tfidf_analysis("data/prepossessed/englishfairytales.txt", "data/top50eng.csv")
tfidf_analysis("data/prepossessed/russianfairytales.txt", "data/top50rus.csv")
tfidf_analysis("data/prepossessed/indianfairytales.txt", "data/top50ind.csv")
