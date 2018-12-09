#Chapter 4 - Exercise #3
#Return.py
#.py is a Python file

#Start a new Python script by initializing a variable with
#user input of an integer value for manipulation
num = input('Enter an Integer:')

#Next, add a function definition that accepts a single
#argument value to be passed from the caller
def square(num):

#Now, insert into the function block an indented statement
#to validate the passed value as an integer or halt further
#execution of the function's statements
    if not num.isdigit():
        return 'Invalid Entry'

#Then, add indented statements to cast the passed value
#as an int data type then return the sum of squaring that
#value to the caller
    num = int(num)
    return num * num

#Finally, add a statement to output a string and the
#returned value from the function call
print(num, 'Squared Is:', square(num))
