/*158722 files in total*/
/*SELECT * FROM [Reporting].[dbo].[CurrentInforcePolicies]*/

/*For Counting # of files in total*/
--SELECT TOP (158722)[Company], --[RISKID],
--COUNT(158722)[Company],COUNT(158722)[RISKID]--,
----SUM(COUNT(*)) OVER()
--FROM [Reporting].[dbo].[CurrentInforcePolicies]
--GROUP BY [Company]--,[RISKID]

--SELECT TOP (158613)SUM(COUNT(*)) OVER ()

/* For FPW */
--(SELECT COUNT([RISKID]) FROM CurrentInforcePolicies WHERE ProgramCode = 'W') 
--(SELECT COUNT([RISKID]) FROM CurrentInforcePolicies) 

/*For Edison*/
--(SELECT COUNT([RISKID]) FROM CurrentInforcePolicies WHERE ProgramCode = 'Y') 
--(SELECT COUNT([RISKID]) FROM CurrentInforcePolicies) 

/*For FPH - Elite*/
--(SELECT COUNT([RISKID]) FROM CurrentInforcePolicies WHERE ProgramCode = 'E') 
--(SELECT COUNT([RISKID]) FROM CurrentInforcePolicies) 

/*For FPH - Preferred*/
--(SELECT COUNT([RISKID]) FROM CurrentInforcePolicies WHERE ProgramCode = 'P') 
--(SELECT COUNT([RISKID]) FROM CurrentInforcePolicies) 


SELECT ProgramCode, 
       count(ProgramCode) as Total,
       count(ProgramCode) * 100.0 / (select count(*) from [Reporting].[dbo].[CurrentInforcePolicies]) as Percentage
FROM [Reporting].[dbo].[CurrentInforcePolicies]
GROUP BY ProgramCode 