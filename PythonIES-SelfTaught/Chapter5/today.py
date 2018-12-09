#Chapter 5 - Exercise #10
#Today.py
#.py is a Python file

#Start a new Python script by importing the "datetime"
#module to make its features available
from datetime import *

#Next, create a datetime object with attributes assigned to
#current date and time values then display its contents
today = datetime.today()
print('Today Is:', today)

#Add a loop to display each attribute value individually
for attr in \
    ['year', 'month', 'day', 'hour', 'minute', 'second', 'microsecond']:
    print(attr,':\t', getattr(today, attr))

#Now, add a statement to display time using dot notation
print('Time:', today.hour, ':', today.minute, sep = '')

#Then, assign formatted day and month names to variables
day = today.strftime('%A')
month = today.strftime('%B')

#Finally, add a statement to display the formatted date
print('Date:', day, month, today.day)
