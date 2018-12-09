EXPORT fn_LimitValue(n,maxval) := IF(n > maxval, maxval, n); //to check values, comment out the EXPORT ONLY

//fn_LimitValue(3,10);
//fn_LimitValue(13,10);
//fn_LimitValue(30,10);