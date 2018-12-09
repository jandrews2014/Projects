#Chapter 6 - Exercise #1
#Manipulate.py
#.py is a Python file

#Start a new Python script by defining a simple function
#that includes a docstring description
def display(s):
    '''Display an argument value.'''
    print(s)

#Next, add a statement to display the function description
display(display.__doc__)

#Now, add a statement to display a raw string value that
#contains the backlash character
display(r'C:\Program Files')

#Then, add a statement to display a concatenation of two
#string values that include an escape character and a space
display('\nHello' + 'Python')

#Next, add a statement to display a slice of a specified
#string within a range of element index numbers
display('Python In Easy Steps\n'[7:])

#Finally, display the results of seeking characters within a
#specified string
display('P' in 'Python')
display('p' in 'Python')
