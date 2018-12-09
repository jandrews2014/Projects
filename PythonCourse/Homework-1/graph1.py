# example of graphing a function with pylab

import pylab    # needed for creating chart figures
import math

xs = []
ys = []
# prepare the domain for the function we graph
x0 = -4.0    # lower bound
x1 = +4.0    # upper bound

n = 100                     # n points
dx = (x1 - x0) / n          # delta between points

x = x0

while x <= x1:
    xs.append(x)

    # edit this function
    #y = 2 * math.sin(2*math.pi*1*x)
    y = x**2 - 3*x + 2

    
    ys.append(y)
    x += dx

# after the loop:
pylab.plot(xs, ys, "ro-")    # creates the graph figure, but does not show it yet

pylab.show()     # what it says...


