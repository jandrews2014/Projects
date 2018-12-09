#Chapter 7 - Exercise #6
#polymorph.py
#.py is a Python file

#Save the two class files then start a new Python script by
#making features of both classes available
from Duck import *
from Mouse import *

#Next, define a function that accepts any single object as
#its argument and attempts to call methods of that object
def describe(object):
    object.talk()
    object.coat()

#Now, create an instance object of each class
donald = Duck()
mickey = Mouse()

#Finally, add statements to call the function and pass each
#instance object to it as an argument
describe(donald)
describe(mickey)
