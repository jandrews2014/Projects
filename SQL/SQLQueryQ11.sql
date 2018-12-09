SELECT TOP (158722)[DedHurricane],
COUNT(158722)[DedHurricane]
FROM [Reporting].[dbo].[CurrentInforcePolicies]
GROUP BY [DedHurricane]
ORDER BY COUNT(158613) DESC