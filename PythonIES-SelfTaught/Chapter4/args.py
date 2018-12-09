#Chapter 4 - Exercise #2
#Args.py
#.py is a Python file

#Start a new Python script by defining a function to accept
#three arguments that will print out their passed in values
def echo(user, lang, sys):
    print('User:', user, 'Language:', lang, 'Platform:', sys)


#Next, call the function passing string values to the
#function arguments in the order they appear
echo('Mike', 'Python', 'Windows')

#Now, call the function passing string values to the
#function arguments by specifying the argument names
echo(lang = 'Python', sys = 'Mac OS', user = 'Anne')

#Then, define another function to accept two arguments
#with default values that will print out argument values
def mirror(user = 'Carole',lang = 'Python'):
    print('\nUser:',user,'Language:', lang)

#Finally, add statements to call the second function both
#using and overriding default values
mirror()
mirror(lang = 'Java')
mirror(user = 'Tony')
mirror('Susan', 'C++')
