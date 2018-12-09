#Chapter 7 - Exercise #1
#Bird.py
#.py is a Python file

#Start a new Python script by declaring a new class with a
#descriptive document string
class Bird:
    '''A base class to define bird properties.'''

#Next, add an indented statement to declare and initialize
#a class variable attribute with an integer zero value
    count = 0

#Now, define the initializer class method to initialize an
#instance variable and to increment the class variable
    def __init__(self, chat):
        self.sound = chat
        Bird.count += 1

#Finally, add a class method to return the value of the
#instance variable when called - then save this class file
    def talk(self):

        return self.sound

