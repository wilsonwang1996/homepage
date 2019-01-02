import pandas as pd
import json

data = pd.read_csv("../data/word_data_merged_short.csv")
word_dict = {"name": "dictionary", "children": []}
age_types = set()
for age in set(data['AoA']):
    word_dict["children"].append({"name": age, "children": []})
for index, row in data.iterrows():
    word = row["word"]
    first_char = word[0]
    first_two_char = word[:2]
    AoA = row["AoA"]
    AoA_match = False
    for AoA_item in word_dict["children"]:
        if AoA_item["name"] == AoA:
            AoA_match = True
            first_char_match = False
            for first_char_item in AoA_item["children"]:
                if first_char_item["name"] == first_char:
                    first_char_match = True
                    first_two_char_match = False
                    for first_two_char_item in first_char_item["children"]:
                        if first_two_char_item["name"] == first_two_char:
                            first_two_char_match = True
                            word_match = False
                            for word_item in first_char_item["children"]:
                                if word_item["name"] == word:
                                    word_match = True
                            if not word_match:
                                first_two_char_item["children"].append(
                                    {"name": word, "size": 1}
                                )
                    if not first_two_char_match:
                        first_char_item["children"].append(
                            {"name": first_two_char, "children": [
                                {"name": word, "size": 1}
                            ]}
                        )
            if not first_char_match:
                AoA_item["children"].append(
                    {"name": first_char, "children": [
                        {"name": first_two_char, "children": [
                            {"name": word, "size": 1}
                        ]}
                    ]})
    if not AoA_match:
        word_dict["children"].append({"name": AoA, "children": [
            {"name": first_char, "children": [
                {"name": first_two_char, "children": [
                    {"name": word, "size": 1}
                ]}
            ]}
        ]})
print(word_dict)
with open('../data/word_child_chart_short.json', 'w') as outfile:
    json.dump(word_dict, outfile)
