//EXPORT BWR_BasicQueries := 'todo'; 
IMPORT $; 
$.Persons; 
COUNT($.Persons); 
OUTPUT($.Persons,{RecId,LastName,FirstName}); 
OUTPUT($.Persons,{RecId,StreetAddress,City,State,ZipCode},NAMED('Address_Info')); 