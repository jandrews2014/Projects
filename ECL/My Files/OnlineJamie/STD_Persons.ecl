﻿IMPORT $,STD; 

EXPORT STD_Persons := MODULE EXPORT Layout := RECORD $.UID_Persons.UID; 
       $.UID_Persons.RecID; 
       STRING15 FirstName := STD.Str.ToUpperCase($.UID_Persons.FirstName); 
			 STRING25 LastName := STD.Str.ToUpperCase($.UID_Persons.LastName); 
			 STRING1  MiddleName := STD.Str.ToUpperCase($.UID_Persons.MiddleName); 
			 STRING2  NameSuffix := STD.Str.ToUpperCase($.UID_Persons.NameSuffix); 
			 UNSIGNED4  FileDate := (UNSIGNED4)$.UID_Persons.FileDate; 
			 $.UID_Persons.BureauCode; 
			 $.UID_Persons.Gender; 
			 $.UID_Persons.DependentCount; 
			 UNSIGNED4  BirthDate := (UNSIGNED4)$.UID_Persons.BirthDate; 
			 $.UID_Persons.StreetAddress; 
			 $.UID_Persons.City; 
			 $.UID_Persons.State; 
			 UNSIGNED3  ZipCode := (UNSIGNED3)$.UID_Persons.ZipCode; 
END; 

EXPORT File :=TABLE($.UID_Persons,Layout) 
            :PERSIST('~CLASS::JA::PERSIST::STD_Persons'); END; 