EXPORT File_LookupCSZ := MODULE 
       EXPORT Layout := RECORD 
   			 UNSIGNED4  CSZ_ID; 
		  	 STRING20   City; 
				 STRING2    State; 
				 UNSIGNED3  ZipCode; 
END; 

SHARED Filename := '~ONLINE::JMA::OUT::LookupCSZ'; 

EXPORT File     := DATASET(Filename,Layout,FLAT); 

END; 