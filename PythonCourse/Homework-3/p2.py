#--------------Homework 3 Question 2 by Jamie Andrews----------
#1. Import the math library.
#2. Create a def function called compute_pythagoreans which is suposed to calculate
# the values in the Pythagorean Theorem.
#3. Assign list to be a set of i and j values that are in range of n values and the i and j values squared
# should be less than or equal to n values squared and return the list.
#4. Outside of the def function, assign n to be the integer of inputs to input values into the program. 
#5. Print the def function.

#1.
import math

#2. 
def compute_pythagoreans(n):
    #3.
    list = [(i,j) for i in range(n) for j in range(n) if i**2 + j**2 <= n**2]
    return list
    
#4.    
n = int(input("n: "))
#5.
print(compute_pythagoreans(n))
