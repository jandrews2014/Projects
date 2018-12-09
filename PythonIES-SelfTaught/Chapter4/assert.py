#Chapter 4 - Exercise #11
#Assert.py
#.py is a Python file

#Start a new Python script by initializing a list with several
#string values
chars = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']

#Next, display a function to accept a single argument
def display(elem):

#Now, add indented statements in the function body to
#ensure the passed argument value is an integer then
#display a list element of that index number
    assert type(elem) is int, 'Argument Must Be Integer!'
    print('List Element', elem, '=', chars[elem])

#Then, initialize a variable with an integer value and call
#the function, passing this variable value as its argument
elem = 4
display(elem)

#Finally, change the variable value then call the function
#once more, passing the new variable value as its argument
elem = elem/2
display(elem)
