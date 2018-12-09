/*158722 files in total*/
--SELECT * FROM [Reporting].[dbo].[CurrentInforcePolicies]
--SELECT TOP (158722)[PolicyForm],
--COUNT(158722)[PolicyForm]
--FROM [Reporting].[dbo].[CurrentInforcePolicies]
--GROUP BY [PolicyForm]


SELECT PolicyForm, 
       count(PolicyForm) as Total,
       count(PolicyForm) * 100.0 / (select count(*) from [Reporting].[dbo].[CurrentInforcePolicies]) as Percentage
FROM [Reporting].[dbo].[CurrentInforcePolicies]
GROUP BY PolicyForm