#Chapter 7 - Exercise #5
#Polygon.py
#.py is a Python file

#Create a new Python script that declares a base class with
#two class variables and a method to set their values
class Polygon:
    width = 0
    height = 0
    def set_values(self, width, height):
        Polygon.width = width
        Polygon.height = height
    
