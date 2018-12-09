#Chapter 5 - Exercise #11
#Timer.py
#.py is a Python file

#Start a new Python script by importing the "time" module
#to make its features available
from time import *

#Next, initialize a variable with a floating point number
#that is the current elapsed time since the epoch
start_timer = time()

#Now, add a statement to create a struct_time object from
#the elasped time value
struct = localtime(start_timer)

#Then, announce that a countdown timer is about to begin
#from the current time starting point
print('\nStarting Countdown At:', strftime('%X',struct))

#Add a loop to initialize and print a counter variable value
#then decrement the counter by one and pause for one
#second on each iteration
i = 10
while i > -1:
    print(i)
    i -= 1
    sleep(1)

#Next, initialize a variable with a floating point number
#that is the current elasped time now since the Epoch
end_timer = time()

#Now, initialize a variable with the rounded seconds value
#of the time difference between the two timed points
difference = round(end_timer - start_timer)

#Finally, add a statement to display the time taken to
#execute the countdown loop
print('\nRuntime:', difference, 'Seconds')
