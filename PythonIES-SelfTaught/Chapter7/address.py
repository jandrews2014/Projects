#Chapter 7 - Exercise #3
#Address.py
#.py is a Python file

#Start a new Python script by making features of the
#Bird class available that was created on page 118
from Bird import *

#Next, create an instance of the class then add a new
#attribute with an assigned value using dot notation
chick = Bird('Cheep, cheep!')
chick.age = '1 week'

#Now, display the values in a both instance variable
#attributes
print('\nChick Says:', chick.talk())
print('Chick Age:', chick.age)

#Then, modify the new attribute using dot notation and
#display its new value
chick.age = '2 weeks'
print('Chick Now:', chick.age)

#Next, modify the new attribute once more, this time using
#a built-in function
setattr(chick, 'age', '3 weeks')

#Now, display a list of all non-private instance attributes
#and their respective values using a built-in function
print('\nChick Attributes...')
for attrib in dir(chick):
    if attrib[0] != '_':
        print(attrib, ':', getattr(chick, attrib))

#Finally, remove the new attribute and confirm its removal
#using a built-in functions
delattr(chick, 'age')
print('\nChick age Attribute?', hasattr(chick, 'age'))
