IMPORT $; 

EXPORT File_Persons_Slim := MODULE 
       EXPORT Layout := RECORD 
			 RECORDOF($.STD_Persons.File) AND NOT [City,State,ZipCode]; 
			 UNSIGNED4  CSZ_ID; 
END; 

SHARED Filename := '~ONLINE::JMA::OUT::Persons_Slim'; 
EXPORT File     := DATASET(Filename,Layout,FLAT); 
END;
