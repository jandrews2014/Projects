#Chapter 3 - Exercise #5
#If.py
#.py is a Python file

#Start a new Python script by initializing a variable with
#user input of an integer value
num = int(input('Please Enter A Number:'))

#Next, test the variable and display an appropriate response
if num > 5:
    print('Number Exceeds 5')
elif num < 5:
    print('Number is Less Than 5')
else:
    print('Number is 5')

#Now, test the variable again using two expressions and
#display a response only upon success
if num > 7 and num < 9:
    print('Number is 8')
if num == 1 or num == 3:
    print('Number is 1 or 3')
