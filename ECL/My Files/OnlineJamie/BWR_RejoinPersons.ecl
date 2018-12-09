IMPORT $,Std; 

$.File_Persons.Layout Bulkup($.File_Persons_Slim.Layout L, $.File_LookupCSZ.Layout R) := TRANSFORM 
       SELF.ZipCode := IF(R.zipcode=0,'',INTFORMAT(R.zipcode,5,1)); 
			 SELF.FileDate := IF(L.FileDate=0,'',(STRING8)L.FileDate); 
			 SELF.BirthDate := IF(L.BirthDate=0,'',(STRING8)L.BirthDate); 
			 SELF.MaritalStatus := ''; 
			 SELF.FirstName := Std.Str.ToTitleCase(L.FirstName); 
			 SELF.LastName := Std.Str.ToTitleCase(L.LastName); 
			 SELF.MiddleName := Std.Str.ToTitleCase(L.MiddleName); 
			 SELF.NameSuffix := Std.Str.ToTitleCase(L.NameSuffix); 
			 SELF := R; 
			 SELF := L; 
END; 

BulkRecs := JOIN($.File_Persons_Slim.File, $.File_LookupCSZ.File, LEFT.CSZ_ID=RIGHT.CSZ_ID, Bulkup(LEFT,RIGHT),LEFT OUTER,LOOKUP); 
OUTPUT(BulkRecs,,'~ONLINE::JMA::OUT::Persons_Rejoined',OVERWRITE);