#----------Homework 3 Question 3 by Jamie Andrews ------------
#1. Create def function that collects the data from the string
#2. Write a for loop that splits the string.
#3. Create another for loop that prints the string in range of the def functions length.
#4. Declare a variable that opens the csv file in the program.
#5. Assign argument string_pos_1st to array [0,2,3,4] so that it only prints out the 1, 3, 4, and 5 set of strings
#6. Assign sep to ",".
#7. Assign mydata to the def function.

#1.
def get_csv_data(f,string_pos_1st,sep):
    #2.
    for line in f:
        myline = [line.split(sep) for i, line in enumerate(f)]
    #3.
    for i in range(len(string_pos_1st)):
        print(myline[string_pos_1st[i]])

#4.
f = open("lb-james.csv", "r")
#5.
string_pos_1st = [0,2,3,4]
#6. 
sep= ","
#7.
mydata = get_csv_data(f,string_pos_1st,sep)