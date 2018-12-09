#Chapter 4 - Exercise #1
#Scope.py
#.py is a Python file

#Start a new Python script by initializing a global variable
global_var = 1

#Next, create a function named "my_vars" to display the
#value contained within the global variable
def my_vars():
    print('Global Variable:', global_var)

#Now, add indented statements to the function block to
#initialize a local variable and display the value it contains
    local_var = 2
    print('Local variable:', local_var)

#Then, add indented statements to the function block to
#create a coerced global variable and assign an initial value
    global inner_var
    inner_var = 3

#Add a statement after the function to call upon that
#function to execute the statement it contains
my_vars()

#Finally, add a statement to display the value contained in
#the coerced global variable
print('Coerced Global:', inner_var)

    
