#Chapter 3 - Exercise #8
#Nest.py
#.py is a Python file

#Start a new Python script with a statement creating a
#loop that iterates three times
for i in range(1,4):

#Next, add an indented statement creating a "nested" inner
#loop that also iterates three times
    for j in range(1,4):

#Now, add a further-indented statement in the inner loop
#to display the counter numbers (of both the outer loop
#and the inner loop) on each iteration of the inner loop
        print('Running i=', i, 'j=', j)
        
