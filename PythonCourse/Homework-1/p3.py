#-----Homework #1 Question 3 by Jamie Andrews-----

#---------Algorithm Here-----------
#1. Make sure to import all libraries before writing out anything.
#2. Make a while loop for program to calculating coin change.
#3. Declare the variables for quarter, dime, and penny.
#4. Declare an input to enter the amount with.
#5. Declare float variable to equal to amount the user has inputted in system. 
#6. Make if/else statement for if input is negative, the program should print "Invalid input."
# Otherwise the program moves on to step 7. 
#7. Declare 5 variables for calculations for the amount of quarters, dimes and pennies in the amount
#user has inputted.
#8. Declare a variable to calculate the total of coins in amount inputted.
#9. Print the statement stating the amount the user has inputted, number of coins, and
#coin total.

#1.Import the libraries
import math

#2.While loop
while True:
    #3.declare variables
    quarter = .25
    dime = .10
    penny = .01

    #4. Make input
    givemoney = input("Enter the amount:")
    #5. Declare float
    givemoney = float(givemoney)
    #6. If input negative
    if givemoney < 0:
        print ("Invalid input.")
    else:
        #7. Declare variables for calculations
        q = givemoney // quarter
        qtotal = givemoney - (q * quarter)
        d = qtotal // dime
        dtotal = qtotal - (d * dime)
        p = dtotal // penny

        #8. Declare variable for coin total
        c = q + d + p

        #9. Print statement
        print("$","%.2f" % givemoney, "makes","%i" % q , "quarters,","%i" % d, "dimes, and", \
          "%i" % p, "pennies (", "%i" % c, "coins), total amount in coins: $", \
          "%.2f" % givemoney)
       
