#Chapter 7 - Exercise #5
#inherit.py
#.py is a Python file

#Save the three class files then start a new Python script by
#making features of both derived classes available
from Rectangle import *
from Triangle import *

#Next, create an instance of each derived class
rect = Rectangle()
trey = Triangle()

#Now, call the class method inherited from the base class,
#passing arguments to assign to the class variables
rect.set_values(4,5)
trey.set_values(4,5)

#Finally, display the result of manipulating the class
#variables inherited from the base class
print('Rectangle Area:', rect.area())
print('Triangle Area:',trey.area())
