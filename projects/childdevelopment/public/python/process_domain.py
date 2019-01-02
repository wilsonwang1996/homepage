import pandas as pd
import json

data = pd.read_csv("../data/word_data_merged_short.csv")
pre_dict = dict()
for age in set(data['AoA']):
    pre_dict[age] = {
        'Prevalence': 0.0,
        'concreteness': 0.0,
        'valence': 0.0,
        'arousal': 0.0,
        'dominance': 0.0,
        'count': 0
    }
for index, row in data.iterrows():
    pre_dict[row['AoA']]['Prevalence'] += row['Prevalence']
    pre_dict[row['AoA']]['concreteness'] += row['concreteness']
    pre_dict[row['AoA']]['valence'] += row['valence']
    pre_dict[row['AoA']]['arousal'] += row['arousal']
    pre_dict[row['AoA']]['dominance'] += row['dominance']
    pre_dict[row['AoA']]['count'] += 1
for item in pre_dict:
    pre_dict[item]['Prevalence'] /= pre_dict[item]['count']
    pre_dict[item]['concreteness'] /= pre_dict[item]['count']
    pre_dict[item]['valence'] /= pre_dict[item]['count']
    pre_dict[item]['arousal'] /= pre_dict[item]['count']
    pre_dict[item]['dominance'] /= pre_dict[item]['count']
    del pre_dict[item]['count']
pre_dict_sum = {
    'Prevalence': 0.0,
    'concreteness': 0.0,
    'valence': 0.0,
    'arousal': 0.0,
    'dominance': 0.0
}
for item in pre_dict:
    pre_dict_sum['Prevalence'] += pre_dict[item]['Prevalence']
    pre_dict_sum['concreteness'] += pre_dict[item]['concreteness']
    pre_dict_sum['valence'] += pre_dict[item]['valence']
    pre_dict_sum['arousal'] += pre_dict[item]['arousal']
    pre_dict_sum['dominance'] += pre_dict[item]['dominance']
for item in pre_dict:
    pre_dict[item]['Prevalence'] /= pre_dict_sum['Prevalence']
    pre_dict[item]['concreteness'] /= pre_dict_sum['concreteness']
    pre_dict[item]['valence'] /= pre_dict_sum['valence']
    pre_dict[item]['arousal'] /= pre_dict_sum['arousal']
    pre_dict[item]['dominance'] /= pre_dict_sum['dominance']
# print(pre_dict)
word_dict = {"name": "dictionary", "children": []}
for prop in pre_dict[2].keys():
    word_dict["children"].append({
        "name": prop,
        "children": [{"name": x, "size": pre_dict[x][prop]} for x in pre_dict]
    })
print(word_dict)
with open('../data/classified_props_short.json', 'w') as outfile:
    json.dump(word_dict, outfile)
