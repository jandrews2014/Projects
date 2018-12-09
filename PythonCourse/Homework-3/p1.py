#--------------Homework 3 Question 1 by Jamie Andrews-----------
#1. Define the input tuple and call in 3 different arguments. 
#2. Call in 5 different variables and assign it to the a.split(separator).
#3. Write and if/else statement to determine whether the fulltime is true or not.
#4. Call a variable called mytup[i] and assign to the 5 other variables.
#5. Create a for loop in which takes the tuples that are in range of the 5 variables.
#6. Set mytup equal to the tuple of mytup and return it.
#7. Create a def function that is supposed to take the input of the tuples entered into the program.
#8. Repeat steps 2-4, however the variable should be called 'raw' when assigning it to the other 5 variables.
#9. Set mylist to be assigned to the range of raw.
#10. Create a def function that reads the tuples into the program.
#11. Create a for loop in which handles the inputs into the program.
#12. Write an try/except statement in which the program will read the file and see if it equals
# to the tuple def function (the first one), if it does not then it will print 'asdf' and it will break.
#13. Outside of the 3 def functions, call file object and have it assigned to open a txt file.
#14. Assign type to the 5 variables.
#15. Assign separator to be a ','.
#16. Assign myfile to third def function and print myfile.

#1.
def input_tuple(a, type, separator): 
    #2.
    firstname, lastname, age, id, fulltime  = a.split(separator)
    
    #3.
    if fulltime=='true' or fulltime=='1':
        fulltime = '1'
    else:
        fulltime = '0'
        
    #4.
    mytup = [firstname, lastname, age, id, bool(eval(fulltime))]
   
    #5.
    for i in range(len(mytup)):      
            mytup[i] = type[i](mytup[i])
        
    #6.
    mytup = tuple(mytup)
    return mytup

    
#7.
def input_tuple_lc(a, type, separator):
    #8.
    firstname, lastname, age, ID, fulltime  = a.split(separator)
    

    if fulltime=='true' or fulltime=='1':
        fulltime = '1'
    else:
        fulltime = '0'
    raw = [firstname, lastname, age, ID, bool(eval(fulltime))]
    
    #9.
    mylist = [type[i](raw[i]) for i in range(len(raw))]
    return mylist

#10.
def read_tuple(file_obj,type, separator):
        #11.
        for line in file_obj:
            #12.
            try:
                myfile = input_tuple(line,type,separator)
                print(myfile)
            except 'empty' in line:
                print("adsf")
                break
            
        
        
#13.
file_obj = open('textfile.txt','r')
#14.
type = [str, str, float, int, bool]
#15.
separator = ','

#16.
myfile = read_tuple(file_obj,type,separator)
print(myfile)
