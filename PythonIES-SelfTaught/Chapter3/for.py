#Chapter 3 - Exercise #7
#For.py
#.py is a Python File

#Start a new Python script by initializing a list, a tuple,
#and a dictionary
chars = ['A','B','C']
fruit = ('Apple', 'Banana', 'Cherry')
dict = {'name':'Mike','ref':'Python','sys':'Win'}

#Next, add statements to display all list element values
print('\nElements:\t', end = '')
for item in chars:
    print(item, end = '')

#Now, add statements to display all list element values and
#their relative index number
print('\nEnumerated:\t', end = '')
for item in enumerate(chars):
    print(item, end = '')

#Then, add statements to display all list and tuple elements
print('\nZipped:\t', end = '')
for item in zip(chars, fruit):
    print(item, end = '')

#Finally, add statements to display all dictionary key names
#and associated element values
print('\nPaired:')
for key, value in dict.items():
    print(key, '=', value)
