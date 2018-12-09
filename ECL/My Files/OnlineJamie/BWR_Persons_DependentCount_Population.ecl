IMPORT $; 

   c1 := COUNT($.File_Persons.File(DependentCount=0)); 
	 c2 := COUNT($.File_Persons.File); 
	 c3 := (INTEGER)(((c2-c1)/c2)*100.0); 
	 
	 d := DATASET([ {'Total Records',c2}, {'Recs=0',c1}, {'Population Pct',c3}], {STRING15 valuetype,INTEGER val}); 
	 
OUTPUT(d); 