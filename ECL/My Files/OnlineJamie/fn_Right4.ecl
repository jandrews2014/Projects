fn_Right4(STRING s) := IF(LENGTH(TRIM(s)) > 4, s[LENGTH(TRIM(s))-3..], s);                   
fn_Right4('thisismystring');     //returns ring 
fn_Right4('33334-1502    ');     //returns 1502