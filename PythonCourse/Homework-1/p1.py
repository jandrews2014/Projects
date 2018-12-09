#-------Homework 1 Question 1 by Jamie Andrews-------

#Import the libraries
import math

# Making the print statements for introduction
print("This program determines the weekly salary of an employee.")
print("The salary is the sum of the hourly rate times the", \
      "hours worked, plus the bonus.")
print("For work hours exceeding 40 hours per week, an overtime rate", \
      "of 1.5 is applied.")
print("The user must indicate if the worker has received a", \
      "bonus by answering a y/n question.")
print("Input consists of: hours worked, hourly rate, bonus.")
print("The output is the total salary for this week.")

# End of print statements for introduction
# Now for program executable statements

# Enter the amount of hours of work (must be float)
# Edit 1/17/17 at 9:00 AM : This line works
hour = float(input('Enter the number of hours worked this week:'))

# Enter the amount of pay per hour (must be in hour)
# Edit 1/17/17 at 9:04 AM : line works but I added the ':' in input statement
rate = float(input("Enter the salary rate per hour" \
                 "(do not include the '$' sign):"))
#Answer y/n question 
#Edit 1/17/17 at 9:12 AM : Line did not work because I used int instead of str
#Edit 1/17/17 at 9:14 AM : Line now works
#Edit 1/17/17 at 9:55 AM : removed string from line (not needed)
bonus = input("Did the worker get a bonus?(y/n)")

#Preparing if/else statement
#Edit 1/17/17 at 10:22 AM : if/else statement finally fixed 
if bonus == 'y':
    input("Enter bonus:")
    print("")
elif bonus == 'n':
    print("")
else:
    print("")

#preparing second if/else statement
#Edit 01/17/17 at 11:20 AM : if/else statement finally fixed
if hour > 40:
        #40 hours or more is overtime
        overtime = (hour - 40) * rate * 1.5
        #The remaining 40 hours will be under the regular salary
        hour = 40
        
else:
        #Otherwise no overtime
        overtime = 0

#Calculations for the regular salary and total salary
regular = hour * rate
salary = regular + overtime
        
#print statement for total salary
print("The total salary is $", "%.2f" % salary, \
      "(overtime pay $", "%.2f" % overtime,  \
      ")")
#Edit 01/17/17 at 11:43 AM : p1.py is finished, total time was 4 hours.
