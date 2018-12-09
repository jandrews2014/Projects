#----------------Homework 5 Problem 2 by Jamie Andrews---------------
#1. Create a def function called ed_read which returns the file as a string
#2. Create a def function called ed_find which searches the string through filename and returns a list.
#3. Create a def function called ed_replace which replaces search_str in the file with string replace_with.
#4. Create a def function called ed_append which appends the string to the end of the file.
#5. Create a def function called ed_write which writes to the file as position pos the string s.
#6. Create a def funtion called ed_insert which inserts into the file content.


#4.
def ed_append(filename,string):
    pass

#1.  
def ed_read(filename, x1 = 0, x2 = -1):
    with open(filename, 'r') as f:
        for i, j in enumerate(f):
            if x1<=i<=x2:
                print(j)
            elif i>x2:
                break
#2.    
def ed_find(filename, search_str):
    pass
    
#3.
def ed_replace(filename, search_str, replace_with, occurence = -1):
    pass
    
def ed_write(filename, pos_str_col):
    pass
    
def ed_insert(fn):
    pass
    
fn = "file1.txt" # assume this file does not exist yet.
ed_append(fn, "0123456789") # this will create a new file
ed_append(fn, "0123456789") # the file content is: 01234567890123456789
print(ed_read(fn, 3, 9)) # prints 345678. Notice that the interval excludes index to (9)
print(ed_read(fn, 3)) # prints from 3 to the end of the file: 34567890123456789
lst = ed_find(fn, "345")
print(lst) # prints [3, 13]
print(ed_find(fn, "356")) # prints []
ed_replace(fn, "345", "ABCDE", 1) # changes the file to 0123456789012ABCDE6789
# assume we reset the file content to 01234567890123456789 (not shown)
ed_replace(fn, "345", "ABCDE") # changes the file to 012ABCDE6789012ABCDE6789
# assume we reset the file content to 01234567890123456789 (not shown)
# this function overwrites original content:
ed_write(fn, ((2, "ABC"), (10, "DEFG"))) # changes file to: 01ABC56789DEFG456789
# this should work with lists as well: [(2, "ABC"), (10, "DEFG")]
# assume we reset the file content to 01234567890123456789 (not shown)
ed_write(fn, ((2, "ABC"), (30, "DEFG"))) # fails. raises ValueError("invalid position 30")
# assume we reset the file content to 01234567890123456789 (not shown)
# this function inserts new text, without overwriting:
ed_insert(fn, ((2, "ABC"), (10, "DEFG")))
# changed file to: 01ABC23456789DEFG0123456789
