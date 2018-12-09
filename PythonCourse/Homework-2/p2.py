#------- Homework 2 Problem 2 by Jamie Andrews -------
# --------------------Part A-------------------------
#1. Create a def function that finds the duplicate string.
#2. Assign a variable to 0.
#3. Create a nested for loop that searches for anything in range within the string.
#4. Create a nested if statement that finds the duplicate in the string and returns the duplicate.

#1.
def find_dup_str(s, n):
    #2.
    a = 0
    #3.
    for i in range(len(s)-1):
        for j in range(len(s)-1):
            #4.
            if i != j:
                if s[i:i+n] == s[j:j+n]:
                    a = s[i:i+n]
                    return a
                    
#--------------------Part B--------------------------
#1. Create a def function that finds the most occurring duplicate.
#2. Set a variable and assign it to be the length of the string. 
#3. Create a while loop stating that the variable is greater than 0. 
#4. In the while loop assign a variable that is equal to an empty set.
#5. Create an if/else statement for what happens if c has duplicates and does not equal to 0.
#6. Repeat steps 3 & 4 in Part A.
#7. If else, then return the empty set.
#8. Declare 2 separate strings, one for each def function and length number.
#9. Print out the 2 def functions.

#1.
def find_max_dup(s):
    #2.
    b = len(s) - 1
    #3.
    while b >= 0:
        #4.
        c = set()
        #5.
        if c != 0:
            #6.
            for i in range(len(s)-1):
                for j in range(len(s)-1):
                    if i != j:
                        if s[i:i+n] == s[j:j+n]:
                            a = s[i:i+n]
                            return a
        #7.                    
        else:
            b = b - 1
            return c
#8.    
s = 'abcdefbcdgh'
d = 'abcdefgheabcd'
n = 3

#9.
print("duplicate string:", find_dup_str(s,n))
print(find_max_dup(d))