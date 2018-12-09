#Chapter 4 - Exercise #8
#Yield.py
#.py is a Python file

#Start a new Python script by defining a function that
#begins by initializing two variables with an integer of none
def fibonacci_generator():
    a = b = 1

#Next, in the function body insert an indented infinite loop
#to yield the addition of two previous values
    while True:
        yield a
        a, b = b, a + b

#Now, assign the returned generator object to a variable
fib = fibonacci_generator()

#Finally, add a loop to successively call the generator
#function and display its value on each iteration
for i in fib:
    if i > 100:
        break
    else:
        print('Generated:', i)
