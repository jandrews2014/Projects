SELECT TOP (158722)[PropertyCounty],
COUNT(158722)[AgencyCounty]
FROM [Reporting].[dbo].[CurrentInforcePolicies]
GROUP BY [PropertyCounty]
ORDER BY COUNT(158722) 