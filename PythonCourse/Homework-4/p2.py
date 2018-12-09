#--------Homework 4 Problem 2 by Jamie Andrews--------
#1. Create a class called Poly.
#2. Create a constructor in that class.
#3. Set up a list in class.
#4. Create a __str__ def function in the class.
#5. Create a __repr__ def function in the class. 
#6. Create a __getitem__ def function in the class.
#7. Create an __add__ def function in the class.
#8. Create a __mul__ def function in the class.
#9. Create a __rmul__ def function in the class.
#10. Create a __eq__ def function in the class.
#11. Create a __ne__ def function in class.
#12. Create a def function in class called eval().

#1.
class Poly(object):
    #2.
   def __init__(self, numbers):
     if isinstance(numbers, str):
       self.a,self.b,self.c = numbers.split(',')
      
     elif isinstance(numbers, tuple) or isinstance(numbers,list):
       self.a,self.b,self.c = numbers[0],numbers[1],numbers[2]
 
     #3.
     self.mylist = [self.a,self.b,self.c]
 
    #4.
   def __str__(self):
     result = self.a,'+',self.b,'x','+',self.c,'x^2'
     self.result = ''.join(map(str,result))
     return self.result
    
    #5.  
   def __repr__(self):
     return self.result
    
    #6. 
   def __getitem__(self,p):
     return self.mylist[p]
    
    #7.
   def __add__(self,other):
     a,b,c = self.a + other.a, self.b + other.b, self.c + other.c
     p3 = Poly((a,b,c))
     return p3
    
    #8. 
   def __mul__(self,other):
     a,b,c = self.a * other.a, self.b * other.b, self.c * other.c
     p3 = Poly((a,b,c))
     return p3
    
    #9.
   def __rmul__(self,number):
     a,b,c = self.a * number, self.b * number, self.c * number
     p3 = Poly((a,b,c))
     return p3
    
    #10. 
   def __eq__(self,other): 
     first = self.a,self.b,self.c
     second = other.a,other.b,other.c
     if first == second:  
       return True
     else:
       return False
    
    #11.
   def __ne__(self,other): 
     first = self.a,self.b,self.c
     second = other.a,other.b,other.c
     if first != second:  
       return True
     else:
       return False
  
   #12.    
   def eval():
     pass