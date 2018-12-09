#------------Homework 4 Question 1 by Jamie Andrews-------------
#1. Import csv library.
#2. Open the file imdb-top-casts.csv and create a dictionary.
#3. Create a for loop in which it reads the rows in top casts file.
#4. Open the file imdb-top-rated.csv and create a dictionary.
#5. Create a for loop in which it reads the rows in the top rated file.
#6. Open the file imdb-top-grossing.csv and create a dictionary.
#7. Create a for loop in which it reads the rows for the top grossing file.
#8. Create the necessary variables and assign them to list(). 
#9. 
 
#1.
import csv
 
#2.
reader1 = csv.reader(open("imdb-top-casts.csv", "rt",encoding="utf8"))
cast={}

#3.
for row in reader1:
    cast[row[0]]=[row[1], row[2], row[3], row[4], row[5], row[6], row[7]]
 
#4.
reader2 = csv.reader(open("imdb-top-rated.csv", "rt",encoding="utf8"))
rated={}

#5.
for row in reader2:
    rated[row[1]]=[row[1], row[2], row[3]]
 
#6.
reader3 = csv.reader(open("imdb-top-grossing.csv", "rt",encoding="utf8"))
gross={}

#7.
for row in reader3:
    gross[row[0]]=[row[1], row[2], row[3]]
 
#8.
rated_title = list()
rated_year = list()
rated_rating = list()
gross_title = list()
gross_year = list()
gross_box = list()
 
#9.
with open('imdb-top-rated.csv', 'r') as raw_data:
    for line in raw_data:
        if line.startswith('Classification'):
            continue # skip the header line
        line = line.strip().split(',')
        rated_title.append(line[1])
        rated_year.append(line[2])
        rated_rating.append(line[3])

#10.          
with open('imdb-top-grossing.csv', 'r') as raw_data:
    for line in raw_data:
        if line.startswith('Classification'):
            continue # skip the header line
        line = line.strip().split(',')
        gross_title.append(line[1])
        gross_year.append(line[2])
        gross_box.append(line[3])
 
 
#--------------------------------------------------------------------
#a.) displays a ranking(descending of the movie 
#    directors with the most movies in the top rated list.
#    print only the top 5 directors, with a proper title above. 
#    imdb-top-rated.csv
count = 0
for i in range(len(rated_title)):
  if rated_title[i] == cast.items().next():
    count = count + 1
  else:
    count = count + 0
 
print(count)    
#--------------------------------------------------------------------
#b) Displays a ranking (descending) of the directors with the 
#most movies in the top grossing list. Print
#only the top 5 directors, with a proper title above.
#COUNTER
 
#--------------------------------------------------------------------
#c) Displays a ranking (descending) of the actors with 
#the most movie credits from the top rated list.
#Print only the top 5 actors, with a proper title above.
 
 
#--------------------------------------------------------------------
#d)Displays a ranking of movies (descending) based on a 
#combined rating/grossing score. The score for
#a movie with rating rank r and grossing rank g is 500-r-g. 
#Exclude movies that are only on one list and
#not on the other. Print only the top 5 movie titles, with their 
#year, with a proper title above.
 
 
#--------------------------------------------------------------------
#e) Displays a ranking (descending) with the actors who brought 
#in the most box office money, based on
#the top grossing movie list. For a movie with gross ticket sales 
#amount s, the 5 actors on the cast list
#will split amount s in the following way: