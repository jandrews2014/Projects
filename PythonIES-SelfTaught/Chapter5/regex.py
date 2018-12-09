#Chapter 5 - Exercise #12
#Regex.py
#.py is a Python file

#Start a new Python script by importing the "re" module to
#make the regular expression methods available
from re import *

#Next, initialize a variable with a regular expression object
pattern = \
        compile('(^|\s)[-a-z0-9_.]+@([-a-z0-9]+\.)+[a-z]{2,6}(\s|$)')

#Now, begin a function definition by requesting user input
#and attempt to match that with the pattern
def get_address():
    address = input('Enter Your Email Address:')
    is_valid = pattern.match(address)

#Then, add indented statements to display an appropriate
#message describing whether the attempt succeeded
    if is_valid:
        print('Valid Address:', is_valid.group())
    else:
        print('Invalid Address! Please Retry...\n')

#Finally, add a statement to call the defined function
get_address()
