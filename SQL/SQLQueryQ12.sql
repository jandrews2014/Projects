SELECT TOP (158722)[DedAOP],
COUNT(158722)[DedAOP]
FROM [Reporting].[dbo].[CurrentInforcePolicies]
GROUP BY [DedAOP]
ORDER BY COUNT(158613) DESC