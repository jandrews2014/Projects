#Chapter 7 - Exercise #4
#Builtin.py
#.py is a Python file

#Start a new Python script by making features of the Bird
#class available that was created on page 118
from Bird import *

#Next, add a statement to create an instance of the class
zola = Bird('Beep, beep!')

#Now, add a loop to display all built-in instance attributes
print('\nBuilt-in Instance Attributes...')
for attrib in dir(zola):
    if attrib[0] == '_':
        print(attrib)

#Then, add a loop to display all items in the class dictionary
print('\nClass Dictionary...')
for item in Bird.__dict__:
    print(item, ':', Bird.__dict__[item])

#Finally, add a loop to display all items in the instance
#dictionary
print('\nInstance Dictionary...')
for item in zola.__dict__:
    print(item, ':', zola.__dict__[item])
    
