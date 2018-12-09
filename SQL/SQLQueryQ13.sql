SELECT [PrimaryInsuredDOB] 
FROM [Reporting].[dbo].[CurrentInforcePolicies]
WHERE PrimaryInsuredDOB NOT IN('NULL')
ORDER BY CAST(PrimaryInsuredDOB AS datetime)