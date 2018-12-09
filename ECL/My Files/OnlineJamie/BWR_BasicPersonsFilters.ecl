//EXPORT BWR_BasicPersonsFilters := 'todo';

IMPORT $; 
COUNT($.Persons(State='FL'));  
COUNT($.Persons(State='FL',City='MIAMI'));  
COUNT($.Persons(ZipCode='33102')); 
COUNT($.Persons(FirstName[1]='B'));  
COUNT($.Persons(FileDate[1..4] > '2000')); 