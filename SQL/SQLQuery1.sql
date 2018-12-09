/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP (1000) [RISKID]
      ,[MailingAddress1]
      ,[MailingAddress2]
      ,[MailingCity]
      ,[MailingState]
      ,[MailingZip]
--SELECT DISTINCT MailingState
  FROM [Reporting].[dbo].[CurrentInforcePolicies]
  WHERE MailingState not in ('AL',
'AK',
'AZ',
'AR',
'CA',
'CO',
'CT',
'DE',
'FL',
'GA',
'HI',
'ID',
'IL',
'IN',
'IA',
'KS',
'KY',
'LA',
'ME',
'MD',
'MA',
'MI',
'MN',
'MS',
'MO',
'MT',
'NE',
'NV',
'NH',
'NJ',
'NM',
'NY',
'NC',
'ND',
'OH',
'OK',
'OR',
'PA',
'RI',
'SC',
'SD',
'TN',
'TX',
'UT',
'VT',
'VA',
'WA',
'WV',
'WI',
'WY')


  