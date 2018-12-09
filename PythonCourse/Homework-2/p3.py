#-------Homework 2 Question 3 by Jamie Andrews-------

#1. Import math and pylab before typing any code.
#2. Declare 2 variables and set is as arrays.
#3. Declare 4 variables and set it as inputs for the function, sample number, max and min of x. 
#4. Declare a variable that divides the difference of the max of x and the min of x divided by the sample number.
#5. Create a while loop that states that the min of x is greater than or equal to the max of x.
#6. In the loop, append the 2 variables declared in step 2 and assign y for evaluation, then increment the min of x with the variable from step 4.
#7. Set the plot of the graph using pylab and the 2 variables declared in step 2.
#8. Create a for loop and use if statements in the for loop stating the inequalities of xs and ys using 0 as a comparison and 
# use a print statement for each inequality.
#9. Make a pylab statement to show the graph.


#1.
import math
import pylab

#2.
xs = []
ys = []

#3.
fun_str = input("Enter function with variable x:")
n = int(input("Enter a number of samples:"))
x = int(input("Enter xmin:"))
xmax = int(input("Enter xmax:"))
#4.
dx = (xmax - x)/n

#5.
while x <= xmax:
    #6.
    xs.append(x)
    
    y = eval(fun_str)
    
    ys.append(y)
    
    x += dx
#7.
pylab.plot(xs, ys, "rx-")

#8.
for i in range(n):
    if xs[i] >= 0 and ys[i] >= 0:
        print('+{:.4f}{:4s}{:.4f}'.format(xs[i],'  ',ys[i]))
    elif xs[i] >= 0 and ys[i] <= 0:
        print('+{:.4f}{:4s}{:.4f}'.format(xs[i],'  ',ys[i]))
    elif xs[i] <= 0 and ys[i] <= 0:
        print('+{:.4f}{:4s}{:.4f}'.format(xs[i],'  ',ys[i]))
#9.        
pylab.show()