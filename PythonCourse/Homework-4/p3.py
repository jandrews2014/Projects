#---------Homework 4 Problem 3 by Jamie Andrews---------
#1. Do Employee SuperClass.
#2. Create Constructor in the Employee Class using variables from the private class.
#3. Create an __str__ def function in the SuperClass.
#4. Create a __repr__ def function in the SuperClass.
#5. Create a def function called salary_total in the SuperClass, which calculates the total of all the salaries earned by the employees in the starter companies 
#6. Create a print_staff function in the SuperClass, which is supposed to print out the lists of all the names, phone numbers and salaries of every employee.
#7. Create a subclass for the SuperClass called Manager.
#8. Create a constructor and two def functions called __str__ and __repr__ into the Manager Class, passing the attributes from the SuperClass.
#9. Crate a sublclass for the SuperClass called Engineer.
#10. Repeat step 8.
#11. Create a sublclass for Manager called CEO.
#12. Repeate step 8.

#1.
class Employee(object):
    #2.
   def __init__(self,name,salary,phone):
     self.__name = str(name)
     self.__salary = float(salary)
     self.__phone = str(phone)
     self.total = Employee.salary_total(self)
    
    #3.
   def __str__(self):
     self.mylist1 = (self.__name,",", self.__phone, ",",self.__salary)
     self.mylist1 = ''.join(map(str,self.mylist1))
     self.mylist2 = (self.__name,",", self.__phone, ",",self.total)
     self.mylist2 = ''.join(map(str,self.mylist2))
     
     return '(' + self.mylist1 + ')' + '\n' + 'Complete Output: ' + self.mylist2
    #4.
   def __repr__(self):
     return '(' + self.mylist + ')'
    
   #5.
   def salary_total(self):
     self.total = self.salary
     self.bonus = input("Bonus: ")
     self.benefits = input("Benefits: ")
 
     self.total = float(self.total) + float(self.bonus) + float(self.benefits)
     return self.total
     
   #6. 
   def print_staff(self):
     self.completelist = [self.__name, ",", self.__phone, ",",self.total]
     self.completelist = ''.join(map(str,self.completelist))
     return self.completelist

#7.        
class Manager(Employee):
    #8.
   def __int__(self,name,salary,phone):
     Employee.__init__(name,salary,phone)
    
   def __str__(self):
     self.result = Employee.__str__(self)
     return 'Manager: (' + self.mylist1 + ')' + '\n' + 'Complete Output: ' + self.mylist2
    
   def __repr__(self):
     return 'Manager: (' + self.mylist1 + ')' + '\n' + 'Complete Output: ' + self.mylist2
    
#9.
class Engineer(Employee):
    #10.
   def __int__(self,name,salary,phone):
     Employee.__init__(name,salary,phone)
     
   def __str__(self):
     self.result = Employee.__str__(self)
     return 'Engineer: (' + self.mylist1 + ')' + '\n' + 'Complete Output: ' + self.mylist2
   def __repr__(self):
     return 'Engineer: (' + self.mylist1 + ')' + '\n' + 'Complete Output: ' + self.mylist2

#11.
class CEO(Manager):
    #12.
    def __int__(self,name,salary,phone):
     Manager.__init__(name,salary,phone)
    
    def __str__(self):
     self.result = Manager.__str__(self)
     return 'CEO: (' + self.mylist1 + ')' + '\n' + 'Complete Output: ' + self.mylist2
    
    def __repr__(self):
     return 'CEO: (' + self.mylist1 + ')' + '\n' + 'Complete Output: ' + self.mylist2
