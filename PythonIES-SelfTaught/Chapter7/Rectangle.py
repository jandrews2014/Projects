#Chapter 7 - Exercise #5
#Rectangle.py
#.py is a Python file

#Next, create a script that declares a derived class with a
#method to return manipulated class variable values
from Polygon import *

class Rectangle(Polygon):
    def area(self):
        return self.width * self.height
    
