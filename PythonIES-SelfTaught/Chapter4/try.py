#Chapter 4 - Exercise #9
#Try.py
#.py is a Python file

#Start a new Python script by initializing a variable with a
#string value
title = 'Python In Easy Steps'

#Next, add a try statement block that attempts to display
#the variable value - but specifies the name incorrectly
try:
    print(titel)

#Now, add an except statement block to display an error
#message when a NameError occurs
except NameError as msg:
    print(msg)
