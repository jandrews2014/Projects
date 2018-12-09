#Chapter 5 - Exercise #7
#System.py
#.py is a Python file

#Start a new Python script by importing the "sys" and
#"keyword" modules to make their features available
import sys, keyword

#Next, add a statement to display the Python version
print('Python Version:', sys.version)

#Now, add a statement to the display the actual location on
#your system of the Python interpreter
print('Python Interpreter Location:', sys.executable)

#Then, add statements to display a list of all directories
#where the Python interpreter looks for module files
print('Print Module Search Path:')
for dir in sys.path:
    print(dir)

#Finally, add statements to display a list of all the Python
#keywords
print('Python Keywords:')
for word in keyword.kwlist:
    print(word)
    
