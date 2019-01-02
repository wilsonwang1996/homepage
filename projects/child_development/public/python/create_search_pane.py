import string, json

a_to_z = string.ascii_lowercase
pane_dict = {"name": "dictionary", "children": []}
for letter in a_to_z:
    first_letter_element = {"name": letter, "children": []}
    for second_letter in a_to_z:
        first_letter_element["children"].append(
            {"name": letter + second_letter, "size": 1}
        )
    pane_dict["children"].append(first_letter_element)
print(pane_dict)
with open('../data/paneDict.json', 'w') as outfile:
    json.dump(pane_dict, outfile)
