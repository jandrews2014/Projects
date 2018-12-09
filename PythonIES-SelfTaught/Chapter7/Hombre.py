#Chapter 7 - Exercise #5
#Hombre.py
#.py is a Python file

#Now, create another script that also declares a derived
#class with a method that once again overrides the same
#method in the base class
from Person import *

'''A derived class to define Hombre properties.'''

class Hombre(Person):
    def speak(self,msg):
        print(self.name, '\n\tHola!', msg)
        
