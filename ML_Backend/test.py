from collections import Counter

# Sample array of labels
labels = ['normal', 'normal', 'spit', 'garbage_litering', 'spit', 'normal', 'garbage_litering', 'spit']

# Filter out the 'normal' labels
filtered_labels = [label for label in labels if label != 'normal']

# Count the occurrences of each label
label_counts = Counter(labels)

# Get the most common label (other than 'normal')
most_common_label = label_counts.most_common(1)
print(dict(label_counts.items()))

if most_common_label:
    label, count = most_common_label[0]
    print(f"The most common label (excluding 'normal') is: '{label}' with {count} occurrences.")
else:
    print("No labels other than 'normal' found.")
