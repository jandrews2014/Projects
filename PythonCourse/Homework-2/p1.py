#--------Homework 2 Question 1 by Jamie Andrews --------

#1. Make sure to import numpy as np before typing any code.
#2. Define a def funtion that generates Pythagorean triples, but only gives out the primitive triples.
#3. Define 3 functions np.mat function to set up the Pythagorean numbers.
#4. Call an array function and set array with the 3 np.mat functions.
#5. Call another array function and set array with integers 3, 4, and 5.
#6. Create a while loop in the def function that generates the numbers used in the Pythagorean Theorem.
#7. Create an if statement in the while loop when if is the limit.
#8. Create a yield statement in the while loop function derived from n.
#9. Create a second def function that generates all pythagorean triples.
#10. Create a for loop in the def function that takes all the primitive triples from the first def function
#11. Create another for loop in the for loop using in range and it should add all the other triples aside from the primitives.
#12. Outside of the def functions, create 2 print statements that prints out a list of the 2 def functions using an exponent value by the 10th power. 

# 1.
import numpy as np

# 2.
def gen_prim_trips(limit = None):
    # 3.
    a = np.mat(' 1  2  2; -2 -1 -2; 2 2 3')
    b = np.mat(' 1  2  2;  2  1  2; 2 2 3')
    c = np.mat('-1 -2 -2;  2  1  2; 2 2 3')
    # 4.
    abc = np.array([a, b, c])
    # 5.
    n = np.array([3, 4, 5])
    # 6.
    while n.size:
        n = n.reshape(-1, 3)
        # 7.
        if limit:
            n = n[n[:, 2] <= limit]
        # 8.
        yield from n
        n = np.dot(n, abc)

# 9.        
def gen_all_trips(limit):
    # 10.
    for prim in gen_prim_trips(limit):
        i = prim
        # 11.
        for _ in range(limit//prim[2]):
            yield i
            i = i + prim
# 12.
print(list(gen_prim_trips(10**2)))
print(list(gen_all_trips(10**2)))