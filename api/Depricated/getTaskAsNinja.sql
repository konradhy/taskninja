SELECT category,firstName,lastName,image,ninjaFName,ninjaLName,jobAccepted,jobCreated,jobDate,jobLocation,jobTime FROM bookings WHERE `taskId` = '@PARAM_taskId' AND `ninjaId` = '@PARAM_ninjaId' ORDER BY `id`