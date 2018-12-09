# ----------Homework 6 Problem 2--------------
#1. Import itertools before beggining part A
#2. Create class called PrimeIter in which manages the prime integers.
#3. Begin Part A by building the constuctor in the class.
#4. Create a def function in the Class PrimeIter called __next__ which returns the next prime number.
#5. Create a def function in the Class PrimeIter called __iter__ which iterates the prime number.
#6. Begin Part B by Creating another class called PrimeGen which generates prime numbers.
#7. Create a constructor in the class PrimeGen.
#8. Create a def function called genPrime in the class PrimeGen which generates prime numbers.
#9. Create an if statement called __name__ which calles out the 2 classes.

#1.
import itertools

#2.
class PrimeIter:
    #3.
    def __init__(self):
        self.current = 1
        
    #4.    
    def __next__(self):
        self.current = self.current + 1
        while 1:
            for i in range(2, self.current//2 + 1):
                if self.current % i == 0:
                    self.current = self.current + 1
                    break # Break current for loop
                else:
                    break # Break the while loop and return
                    return self.current

    #5.                
    def __iter__(self):
        return self
        
        if __name__ == '__main__':
            p = PrimeIter()
            for x in itertools.islice(p, 10):
                print (x)

#6.
class PrimeGen:
    #7.
    def __init__(self):
        self.current = 2
    
    #8.
    def genPrime(self, num):
        for i in range(num):
            while 1:
                for j in range(2, self.current//2 + 1):
                    if self.current % j == 0:
                        self.current = self.current + 1
                        break
                    else:
                        break
                    print (self.current)
                    self.current = self.current + 1
                    
#9.
if __name__ == '__main__':
    p = PrimeGen()
    p.genPrime(10)
