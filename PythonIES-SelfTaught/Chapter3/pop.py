#Chapter 3 - Exercise 2
#Pop.py
#.py is a Python file

#Start a new Python script by initializing two lists of three
#elements each containing string values
basket = ['Apple','Bun','Cola']
crate = ['Egg','Fig','Grape']

#Next, add statements to display the contents of the first list's
#elements and its length
print('Basket List:', basket)
print('Basket Elements:', len(basket))

#Now, add statements to add an element and display all list
#elements, then remove the final element and display all list
#elements once more
basket.append('Damson')
print('Appended:', basket)
print('Last Item Removed:', basket.pop())
print('Basket List:', basket)

#Finally, add statements to add all elements of the second list
#to the first list and display all the first list elements,
#then remove elements and display the first list again
basket.extend(crate)
print('Extended:',basket)
del basket[1]
print('Item Removed:', basket)
del basket [1:3]
print('Slice Removed:', basket)
