#Chapter 6 - Exercise #4
#Unicode.py
#.py is a Python file

#Start a new Python script by initializing a variable with a
#string containing a non-ASCII character then display its
#value, data type, and string length
s = 'Röd'
print('\nRed String:',s)
print('Type:', type(s), '\tLength:', len(s))

#Next, encode the string and again display its value, data
#type, and string length
s = s.encode('utf-8')
print('\nEncoded String:',s)
print('Type:', type(s),'\tLength:', len(s))

#Now, decode the string and once more display its value,
#data type, and string length - to reveal the hexadecimal
#code point of the non-ASCII character
s = s.decode('utf-8')
print('\nDecoded String:', s)
print('Type:', type(s), '\tLength:', len(s))

#Then, add statements to make "unicodedata" features
#available and a loop to reveal the Unicode name of each
#character in the string
import unicodedata
for i in range(len(s)):
    print(s[i], unicodedata.name(s[i]), sep = ':')

#Next, add statements to assign the variable a new value
#that includes a hexadecimal code point for a non-ASCII
#character then display the decoded string value
s = b'Gr\xc3\xb6n'
print('\nGreen String:', s.decode('utf-8'))

#Finally, add statements to assign the variable another new
#value that includes a Unicode character name for a non-
#ASCII character then display the string value
s = 'Gr\N{LATIN SMALL LETTER O WITH DIAERESIS}n'
print('Green String:', s)
