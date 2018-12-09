#Chapter 4 - Exercise #10
#Raise.py
#.py is a Python file

#Start a new Python script by initializing a variable with
#an integer value
day = 32

#Next, add a try statement block that tests the variable
#value then specifies an exception and custom message
try:
    if day > 31:
        raise ValueError('Invalid Day Number')
    #More statements to execute get added here

#Now, add an except statement block to display an error
#message when a ValueError occurs
except ValueError as msg:
    print('The program found An', msg)

#Then, add a finally statement block to display a message
#after the exception has been handled successfully
finally:
    print('But Today Is Beautiful Anyway.')
    
