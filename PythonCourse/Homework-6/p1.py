#-----------Homework 6 Problem 1------------
#1. Import turtle before beggining this problem.
#2. Create a def function called draw_life in which draws out the binary tree.
#3. Create if/else statement that if for else the program draws the binary tree.
#4. Create several statements in which it prints the binary tree.
#5. Create a def function called power in which computes exponents.
#6. Create if/else statement that helps compute the exponents for every condition.
#7. Print out the exponents.
#8. Create a def function called slice_sum in which the program computes the sum recursively.
#9. Create an if/else statement to perform the task.
#10. Create two lists to correspond to the def function.

#1.
import turtle

#2.
def draw_life(length,depth):
    
    #3.
    if depth==0:
        return
    else:
       
        t.fd(length/2)
       
        #left side of turtle
        draw_life(length/2,depth-1)
        t.bk(length/2)
        t.left(60)
        t.fd(length/2)
        t.right(60)
       
        #right side of turtle
        draw_life(length/2,depth-1)
        t.left(60)
        t.bk(length/2)
        t.right(60)
        return
 #4.
window = turtle.Screen()
t = turtle.Turtle()
t.color("green")
t.right(120)                              
draw_life(160,5)
window.exitonclick()
 
#5. 
def power(x,n):
    #6.
    if n == 0:
        return 1
    elif n == 1:
        return x
    elif n == 2:
        return x * x
    elif n % 2 != 0:
        return x * power(x, n-1)
    elif n % 2 == 0:
        return power(x,n//2) * power(x,n//2)
        
#7.       
i = power(2,3)
print(i)
 
#8.
def slice_sum(lst, begin, end):
  
    #9.
    if end==0:
        return 0
    else:
        return lst[begin] + slice_sum(lst,begin+1,end-1)
        
#10.       
X=[0,1,2,3,4,5]
i = [3,2,6,2,1]