#Chapter 7 - Exercise #6
#Person.py
#.py is a Python file

#Create a new Python script that declares a base class with
#an initializer method to set an instance variable and a
#second method to display that variable value
class Person:
    '''A base class to define Person properties.'''

    def __init__(self, name):
        self.name = name

    def speak(self, msg = '(Calling The Base Class)'):
        print(self.name, msg)

