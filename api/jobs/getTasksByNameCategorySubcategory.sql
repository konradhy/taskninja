SELECT jobId,name,description,shortDescription,averagePrice,image,gallery,category,subcategory FROM jobs WHERE `name` LIKE '%@PARAM_name%' OR `category` LIKE '%@PARAM_name%' OR `subcategory` LIKE '%@PARAM_name%' ORDER BY `category`, `subcategory`, `name`