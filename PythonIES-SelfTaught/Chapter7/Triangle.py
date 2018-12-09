#Chapter 7 - Exercise #5
#Triangle.py
#.py is a Python file

#Now, create another script that declares a derived class
#with a method to return manipulated class variable values
from Polygon import *

class Triangle(Polygon):
    def area(self):
        return (self.width * self.height)/2
    
