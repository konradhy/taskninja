   var cloudbackend = require('appdrag-cloudbackend');
   cloudbackend.init(process.env.APIKEY, process.env.APPID);
   var moment = require('moment')
   
   const uuid = require ('uuid')
   var request = require('request'); //pretty sure this came up during some despearte scrambling
   
   
    var API_KEY = 'bd57f19e0bd238f2c4a861331e2b4b7b-0afbfc6c-9e5951de';
    var DOMAIN = 'mail.taskninjaservices.com';

    var mg = require('mailgun-js')({
        apiKey: API_KEY,
        domain: DOMAIN
    });


   exports.handler = async(job, context, callback) => {
       // 1) Get the input parameters
       var ownerEmail = cleanVar(job["POST"]["email"]);
       var ownerToken = cleanVar(job["POST"]["token"]);
       var jobId = cleanVar(job["POST"]["jobId"]);
       var location = cleanVar(job["POST"]["location"]);//change to joblocation
       var date = cleanVar(job["POST"]["date"]); //change to jobDate
       var clientSuggestedPrice = cleanVar(job["POST"]["clientSuggestedPrice"]);
       var jobTime = cleanVar(job["POST"]["jobTime"]); 
       var jobDetails = cleanVar(job["POST"]["jobDetails"]); 
       var timeFlexibility = cleanVar(job["POST"]["timeFlexibility"]); 
       var dateFlexibility = cleanVar(job["POST"]["dateFlexibility"]); 
       var vehicleRequirments = cleanVar(job["POST"]["vehicleRequirments"]); 
       var locationDetails = cleanVar(job["POST"]["locationDetails"]);
       var ninjasRequired = cleanVar(job["POST"]["ninjasRequired"]);
       var currency = cleanVar(job["POST"]["currency"]);
       var picturesOfJob = job["POST"]["picturesOfJob"];
       
       // add pictures of job
       
       
       
     
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
       
               var jobAveragePrice = jobInfos.averagePrice;
            
               var jobImage = jobInfos.image;
               var jobCategory = jobInfos.category;
               var jobSubcategory= jobInfos.subcategory
             
               // 6) Insert the booking into the database 
               var columns = "jobId, userId, category, subcategory,jobName, firstName, lastName, image, jobLocation,jobDate,taskId, jobCreated";
                   columns += ",clientSuggestedPrice, jobTime, jobDetails, timeFlexibility, dateFlexibility"
                   columns += ",vehicleRequirments, locationDetails, picturesOfJob, currency, ninjasRequired"
                   
                   
                   
               var values = "'" + jobId + "','" + userId + "','"+jobCategory+"','"+jobSubcategory+"','"+jobName+"','"+firstName+"','"+lastName+"','"+jobImage+"','"+location+"','"+date+"','"+taskId+"', NOW()";
                  values+=",'"+clientSuggestedPrice+"','"+jobTime+"','"+jobDetails+"','"+timeFlexibility+"','"+dateFlexibility+"'"
                  values+=",'"+vehicleRequirments+"','"+locationDetails+"','"+picturesOfJob+"','"+currency+"','"+ninjasRequired+"'"
                  
                  
               var query = "INSERT INTO bookings (" + columns + ") VALUES (" + values + ")";
               await cloudbackend.sqlExecuteRawQuery(query)
                   .then(function(response) {});
               // 7) Preparing the email components to build the confirmation email 
               if (ownerEmail != "") {
                //   var templateURL = "https://api.appdrag.com/NewsletterViewer.aspx?newsletterID=2161&appID=Task-Ninja-69a87b";
                //   var content = await getTemplateContentFromUrl(templateURL)
                //       // Replace the template placeholders
                //   content = content.replace(/\[FIRST_NAME\]/g, firstName);
                //   content = content.replace(/\[LAST_NAME\]/g, lastName);
                //   content = content.replace(/\[EMAIL\]/g, ownerEmail);
                //   content = content.replace(/\[JOB_NAME\]/g, jobName);
                  
             
                //   content = content.replace(/\[JOB_IMAGE\]/g, "https:" + jobImage);
                   // 8) Send out the email 
                    
                            var email=ownerEmail
                            const data = {
                            from: "Task Ninja Bot <ConfirmationBoss@taskninjaservices.com>",
                        	to: email,
                        	subject: `${firstName}'s ${jobSubcategory} job`,
                        	template: "taskbooked"
                        };
                       await mg.messages().send(data, function(error, body) {
                            console.log(body);
                        });

                   
                //   var subject = "Your " + jobName + " Booking Confrimation!";
                 
                //   await cloudbackend.sendEmail("konradhylton@gmail.com", "Confirmation Boss", ownerEmail, subject, content, true)
                //       .then(function(response) {});
               }
               // 9) Send out the success message 
               var objReturned = new Object();
               objReturned.taskId = taskId;
               objReturned.category = jobCategory;
               objReturned.subcategory = jobSubcategory;
               objReturned.clientSuggestedPrice = clientSuggestedPrice; 
               objReturned.success = "Confirmation_Sent";
               callback(null, objReturned);
           }
       });
   };

  

   function cleanVar(txt) {
       if (txt == null) {
           txt = "";
       }
       return txt.replace(/'/g, "''");
   }