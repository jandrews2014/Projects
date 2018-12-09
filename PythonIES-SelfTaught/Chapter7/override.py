#Chapter 7 - Exercise #5
#override.py
#.py is a Python file

#Save the three class files then start a new Python script by
#making features of both derived classes available
from Man import *
from Hombre import *

#Next, create an instance of each derived class, initializing
#the 'name' instance variable attribute
guy_1 = Man('Richard')
guy_2 = Hombre('Ricardo')

#Now, call the overriding methods of each derived class,
#assigning different values to the "msg" argument
guy_1.speak('It\'s a beautiful evening.\n')
guy_2.speak('Es una tarde hermosa.\n')

#Finally, explicitly call the base class method, passing a
#reference to each derived class - but none for the "msg"
#variable so its default value will be used
Person.speak(guy_1)
Person.speak(guy_2)
