#Chapter 4 - Exercise #4
#Lambda.py
#.py is a Python file

#Start a new Python script by defining three functions to
#return a passed argument raised to various powers
def function_1(x): return x**2
def function_2(x): return x**3
def function_3(x): return x**4

#Next, add a statement to create a list of callbacks to each
#of the functions by referencing their names
callbacks = [function_1, function_2, function_3]

#Now, display a heading and the result of passing a value
#to each of the named functions
print('\nNamed Functions:')
for function in callbacks : print('Result:', function(3))

#Then, add a statement to create a list of callbacks to in-
#line anonymous functions that return a passed argument
#raised to various powers
callbacks = \
          [lambda x: x**2, lambda x: x**3, lambda x: x**4]

#Finally, display a heading and the result of passing a value
#to each of the anonymous functions
print('\nAnonymous Functions:')
for function in callbacks: print('Result:', function(3))
