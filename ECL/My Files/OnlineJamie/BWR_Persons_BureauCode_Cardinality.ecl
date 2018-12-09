IMPORT $; 

     T := TABLE($.File_Persons.File, {$.File_Persons.File.BureauCode});
		 dt := DISTRIBUTE(t,HASH32(BureauCode)); 
		 sdt := SORT(dt,BureauCode,LOCAL); 
		 dsdt := DEDUP(sdt,BureauCode,LOCAL); 

COUNT(dsdt); 