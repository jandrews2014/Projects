#-----Homework 1 Question 2 by Jamie Andrews -----

#Going to import math first to save the trouble for later
import math
import pylab

#while loop will be installed here
while True:
    #Claim my three variables a, b and c
    #Edit 01/17/17 at 11:50 AM : these three lines work
    a = float(input("Enter a:"))
    b = float(input("Enter b:"))
    c = float(input("Enter c:"))

    #z will represent the discriminant in my program
    z = (b**2)-(4 * a * c)
    
    #If/Else statement used for the quadratic formula
    #Edit 01/19/17 at 10:00 AM : This statement works
    if z < 0:
        print("No Real Solutions")
    elif z == 0:
        x1 = ((-b + math.sqrt(z)) / (2 * a))
        print("One Solution:", "%.5f" % x1)
    else:
        x1 = ((-b + math.sqrt(z)) / (2 * a))
        x2 = ((-b - math.sqrt(z)) / (2 * a))
        print("Two Solutions:", "%.5f" % x1, "and", "%.5f" % x2)
    
    #Inner loop for the graphing portion of the code
    #Preparing the x and y graphs
    xs = []
    ys = []
    #Preparing the domain for the graphing function
    x = -5
    x0 = 5
    #N points
    n = 100
    #The delta between points
    dx = (x0 - x)/n
    #Declaring the second while loop
    while x <= x0:
        xs.append(x)
        #Y function should be here
        y = (a*x)**2 + (b*x) + c
        ys.append(y)
        x += dx
    #After the loop 
    pylab.plot(xs,ys,"bo-")
    pylab.show()