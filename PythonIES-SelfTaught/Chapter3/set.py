#Chapter 3 - Exercise 3
#Set.py
#.py is a Python file

#Start a new Python script by initializing a tuple then
#display its contents, length, and type
zoo = ('Kangaroo','Leopard','Moose')
print('Tuple:', zoo, '\tLength:', len(zoo))
print(type(zoo))

#Next, initialize a set and add another element, then
#display its contents, length, and type
bag = {'Red','Green','Blue'}
bag.add('Yellow')
print('\nSet:', bag, '\tLength:',len(bag))
print(type(bag))

#Now, add statements to seek two values in the set
print('\nGreen In the bag Set?:', 'Green' in bag)
print('Is Orange In bag Set?;', 'Orange' in bag)

#Finally, initialize a second set and display its contents,
#length, and all common values found in both sets
box = {'Red','Purple','Yellow'}
print('\nSet:', box, '\tLength', len(box))
print('Common To Both Sets:',bag.intersection(box))
