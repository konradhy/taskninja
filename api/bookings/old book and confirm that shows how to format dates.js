   var cloudbackend = require('appdrag-cloudbackend');
   cloudbackend.init(process.env.APIKEY, process.env.APPID);
   const uuid = require ('uuid')
   var request = require('request');
   exports.handler = async(job, context, callback) => {
       // 1) Get the input parameters
       var ownerEmail = cleanVar(job["POST"]["email"]);
       var ownerToken = cleanVar(job["POST"]["token"]);
       var jobId = cleanVar(job["POST"]["jobId"]);
       var location = cleanVar(job["POST"]["location"]);
       var date = job["POST"]["date"];
       var taskId = uuid.v4();  
       // 2) Verify the user's credentials
       var userInfos = null;
       await cloudbackend.sqlSelect("SELECT * FROM users WHERE email = '" + ownerEmail + "' AND token = '" + ownerToken + "'")
       .then(async function(response) {
           var obj = JSON.parse(response);
           if (obj == null || obj.Table == null) {
               // 3) If credentials are wrong, return error object
               var objReturned = new Object();
               objReturned.error = "INVALID_CREDENTIALS";
               callback(null, objReturned);
           } else {
               // 4) Getting the first and last name of the user 
             
               userInfos = obj.Table[0];
               var userId = userInfos.userId; 
               var firstName = userInfos.firstName;
               var lastName = userInfos.lastName;
               
                 
               // 5) Getting the chosen activity's ID 
               var jobInfos = null;
               await cloudbackend.sqlSelect("SELECT * FROM jobs WHERE jobId = '" + jobId + "'")
                   .then(function(response) {
                       var obj = JSON.parse(response);
                       jobInfos = obj.Table[0];
                       console.log(jobInfos)
                       
                   });
               var jobName = jobInfos.name;
               var jobDate = jobInfos.formatDate;
               var jobPrice = jobInfos.price;
               var jobLocation = jobInfos.location;
               var jobImage = jobInfos.image;
               var jobCategory = jobInfos.category;
               var jobSubcategory= jobInfos.subcategory
             
               // 6) Insert the booking into the database 
               var columns = "jobId, userId, category, firstName, lastName, image, jobLocation,jobDate,taskId, jobCreated";
               var values = "'" + jobId + "','" + userId + "','"+jobCategory+"','"+firstName+"','"+lastName+"','"+jobImage+"','"+location+"','"+date+"','"+taskId+"', NOW()";
               var query = "INSERT INTO bookings (" + columns + ") VALUES (" + values + ")";
               await cloudbackend.sqlExecuteRawQuery(query)
                   .then(function(response) {});
               // 7) Preparing the email components to build the confirmation email 
               if (ownerEmail != "") {
                   var templateURL = "https://api.appdrag.com/NewsletterViewer.aspx?newsletterID=2161&appID=Task-Ninja-69a87b";
                   var content = await getTemplateContentFromUrl(templateURL)
                       // Replace the template placeholders
                   content = content.replace(/\[FIRST_NAME\]/g, firstName);
                   content = content.replace(/\[LAST_NAME\]/g, lastName);
                   content = content.replace(/\[EMAIL\]/g, ownerEmail);
                   content = content.replace(/\[JOB_NAME\]/g, jobName);
                   content = content.replace(/\[JOB_DATE\]/g, jobDate);
                   content = content.replace(/\[JOB_PRICE\]/g, jobPrice);
                   content = content.replace(/\[JOB_LOCATION\]/g, jobLocation);
                   content = content.replace(/\[JOB_IMAGE\]/g, "https:" + jobImage);
                   // 8) Send out the email 
                   var subject = "Your " + jobName + " Booking Confrimation!";
                 
                   await cloudbackend.sendEmail("konradhylton@gmail.com", "Confirmation Boss", ownerEmail, subject, content, true)
                       .then(function(response) {});
               }
               // 9) Send out the success message 
               var objReturned = new Object();
               objReturned.taskId = taskId;
               objReturned.category = jobCategory;
               objReturned.subcategory = jobSubcategory;
               objReturned.success = "Confirmation_Sent";
               callback(null, objReturned);
           }
       });
   };

   function getTemplateContentFromUrl(url) {
       return new Promise(function(resolve, reject) {
           request(url, {
               encoding: null
           }, function(error, response, body) {
               if (!error && response.statusCode == 200) {
                   if (response.headers['content-encoding'] == 'gzip') { // If template is located on AppDrag, file is GZIP by default
                       zlib.gunzip(body, function(err, dezipped) {
                           emailContent = dezipped.toString();
                           return resolve(emailContent);
                       });
                   } else {
                       emailContent = body.toString();
                       return resolve(emailContent);
                   }
               } else {
                   return resolve("ERROR: " + error);
               }
           });
       });
   }

   function cleanVar(txt) {
       if (txt == null) {
           txt = "";
       }
       return txt.replace(/'/g, "''");
   }