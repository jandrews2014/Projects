#Chapter 3 - Exercise #10
#Continue.py
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

#Now, insert this break statement at the very beginning
#of the inner loop block, to break out of the inner loop-
#then save the file and run the program once more
        if i == 2 and j == 1:
            print('Breaks inner loop at i=2 j=1')
            break

#Insert this continue statement at the beginning of the
#inner loop block, to skip the first iteration of the inner
#loop - then save the file and run the program again
        if i == 1 and j == 1:
            print('Continues inner loop at i = 1 j = 1')
            continue
