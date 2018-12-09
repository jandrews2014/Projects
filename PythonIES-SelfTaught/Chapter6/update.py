#Chapter 6 - Exercise #7
#Update.py
#.py is a Python file

#Start a new Python script by assigning a string value to a
#variable containing text to be written in a file
text = 'The political slogan "Workers Of The World Unite!" is from The Communist Manifesto.'

#Next, add statements to write the text string into a file
#and display the file's current status in the "with" block
with open('update.txt','w') as file:
    file.write(text)
    print('\nFile Now Closed?:',file.closed)

#Now, add a non-indented statement after the "with" code
#block to display the file's new status
print('File Now Closed?:', file.closed)

#Then, re-open the file and display its contents to confirm
#it now contains the entire text string
with open('update.txt','r+') as file:
    text = file.read()
    print('\nString:', text)

#Next, add indented statements to display the current file
#position, then reposition and display that new position
    print('\nPosition In File Now:', file.tell())
    position = file.seek(33)
    print('Position In File Now:', file.tell())

#Now, add an indented statement to overwrite the text
#from the current file position
    file.write('All Lands')

#Then, add indented statements to reposition in the file
#once more and overwrite the text from the new position
    file.seek(59)
    file.write('the tombstone of Karl Marx.')

#Finally, add indented statements to return to the start of
#the file and display its entire updated contents
    file.seek(0)
    text = file.read()
    print('\nString:', text)
