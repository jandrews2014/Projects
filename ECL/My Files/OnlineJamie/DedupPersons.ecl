IMPORT $; 

SortPersons := SORT($.Persons,LastName,FirstName,RecId); 
EXPORT DedupPersons := DEDUP(SortPersons,
                             LEFT.Lastname = RIGHT.LastName AND 
														 LEFT.Firstname = RIGHT.FirstName)
							:PERSIST('~CLASS::BMF::TEMP::DedupPersons'); 