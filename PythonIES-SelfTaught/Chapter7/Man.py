#Chapter 7 - Exercise #5
#Man.py
#.py is a Python file

#Next, create a script that declares a derived class with a
#method that overrides the second base class method
from Person import *

'''A derived class to define Man properties.'''

class Man(Person):
    def speak(self,msg):
        print(self.name, '\n\tHello!', msg)
        
