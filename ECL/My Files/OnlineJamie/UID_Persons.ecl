IMPORT $; 

Layout_People_RecID := RECORD 
       UNSIGNED4 UID; 
			 $.File_Persons.Layout; 
END; 

Layout_People_RecID IDRecs($.File_persons.Layout L, INTEGER C) := TRANSFORM SELF.UID := C;
       SELF     := L; 
 END; 
 
 EXPORT UID_Persons := PROJECT($.File_Persons.File,IDRecs(LEFT,COUNTER)) 
                    :PERSIST('~CLASS::JMA::PERSIST::UID_People'); 