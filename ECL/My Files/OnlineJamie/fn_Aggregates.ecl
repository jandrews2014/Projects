IMPORT $; 

//EXPORT 
fn_Aggregates(DATASET(RECORDOF($.Persons)) DS,INTEGER FieldName) := FUNCTION 

  c1 := COUNT(DS(Fieldname = 0));
	s1 := SUM(DS,Fieldname);  
	a1 := AVE(DS,Fieldname);  
	m1 := MAX(DS,Fieldname);  
	m2 := MIN(DS,Fieldname); 
	d := DATASET([{'No Dependents',c1},
	{'Total Dependents',s1},
	{'Average Dependents',a1},
	{'Max Dependents',m1},
	{'Min Dependents',m2}],
	{STRING20 valuetype,INTEGER val});  
	RETURN(d); 
	END;
	
	fn_Aggregates($.Persons,$.Persons.DependentCount);