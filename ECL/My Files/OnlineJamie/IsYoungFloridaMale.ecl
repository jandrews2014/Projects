IMPORT $; 
IsFloridian := $.Persons.State = 'FL'; 
IsMale      := $.Persons.Gender = 'M'; 
IsBorn80    := $.Persons.Birthdate <> '' AND $.Persons.Birthdate[..4] >= '1980' ; 
 
EXPORT IsYoungFloridaMale := IsFloridian AND                              
                             IsMale AND                              
														 IsBorn80;