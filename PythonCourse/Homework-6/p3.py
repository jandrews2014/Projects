#------------Homework 6 Problem 3 --------------
#1. Import the following libaries before doing part A.
#2. Create a def function called gen_rndtup(n) in which generates random sequence.
#3. Write a while loop that for when true it yeilds the random integer.
#4. Create a def function called answer_x in which it prints out the answer for the first tuple.
#5. Create a def function called answer_y in which it prints out the answer for the second tuple.
#6. Create a def function called answer_z in which it prints out the answer for the third tuple.
#7. Create an if statement called __main__ that calls out def functions answer_x, answer_y, and answer_z
 
#1.
from itertools import islice
import random
from functools import reduce

#2.
def gen_rndtup(n):
    """
    This generate infinite sequence of tuple(x,y)  where 0 < x, y < n  
    :param n: 
    :return: 
    """
#3.
    while True:
        yield (random.randint(1, n - 1), random.randint(0, n - 1))

#4.
def answer_x():
    print("Answer x")
    n = 7

    # create object for generator.
    generator_obj = gen_rndtup(n)
    # use the islice function to obtain 10 tuples
    islice_object = islice(generator_obj, 10)
    # make the filter function using lambda  for retrieving tuple like a+b>n/2
    filter_obj = filter(lambda x: x[0] + x[1] > n // 2, islice_object)

    # use start (*) operator to unpack sequence & print the tuples
    print(*filter_obj)

#5.
def answer_y():
    print("Answer y")
    n = 7
    generator_obj = ((random.randint(1, n - 1), random.randint(0, n - 1)) for i in range(10))
    for x in generator_obj:
        if x[0] + x[1] > n // 2:
            print(x, end=" ")
    print()

#6.
def answer_z():
    print("Answer z")
    n = 7
    map_obj = map(lambda x: (random.randint(1, n - 1), random.randint(0, n - 1)), range(10))
    filter_obj = list(filter(lambda x: x[0] + x[1] > n // 2, islice(map_obj, 10)))
    print(filter_obj)
    sum_of_tuples = reduce(lambda x, y: (x[0] + y[0], x[1] + y[1]), filter_obj)
    print(sum_of_tuples)
#7.
if __name__ == '__main__':
    answer_x()
    answer_y()
    answer_z()


