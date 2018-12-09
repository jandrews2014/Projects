IMPORT $; 

//We want a ratio of men in "M" states born before 1980 
//to men in ALL states born before 1980 (express in percentage to two decimal places)  
OlderPersons := $.Persons.Birthdate[1..4] < '1980' AND $.Persons.Birthdate <> ''; 
c1 := COUNT($.MeninMStatesPersons(OlderPersons)); 
c2 := COUNT($.Persons(Gender = 'M',OlderPersons)); 
PercOlderMalesinMStates := (DECIMAL5_2)(c1/c2 * 100); 

//Females: 
OlderFemaleinMStates := COUNT($.Persons(State IN $.SetMStates,OlderPersons,Gender = 'F'));               
AllOlderFemale := COUNT($.Persons(Gender = 'F',OlderPersons));          
PercOlderFemalesinMStates := (DECIMAL5_2)(OlderFemaleinMStates/AllOlderFemale * 100); 

OUTPUT(PercOlderMalesinMStates,NAMED('Men_Percentage')); 
OUTPUT(PercOlderFemalesinMStates,NAMED('Female_Percentage')); 