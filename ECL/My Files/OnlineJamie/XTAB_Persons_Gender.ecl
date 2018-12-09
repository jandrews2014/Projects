IMPORT $; 

r := RECORD 
  $.File_Persons.File.Gender; 
  INTEGER cnt := COUNT(GROUP); 
END; 

EXPORT XTAB_Persons_Gender :=  TABLE($.File_Persons.File,r,Gender); 