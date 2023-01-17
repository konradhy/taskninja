var cloudbackend = require('appdrag-cloudbackend');
cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');

    var API_KEY = 'bd57f19e0bd238f2c4a861331e2b4b7b-0afbfc6c-9e5951de';
    var DOMAIN = 'mail.taskninjaservices.com';

    var mg = require('mailgun-js')({
        apiKey: API_KEY,
        domain: DOMAIN
    }); 


exports.handler = async (event, context, callback) => {
    var ninjaId= cleanVar(event["POST"]["ninjaId"]);
    var taskId =  cleanVar(event["POST"]["taskId"]) 
 
    await cloudbackend.sqlSelect("SELECT * from users where ninjaId= '" +ninjaId+" ' ")
       .then(async (result)=>{
              var parsedResult = JSON.parse(result)
              var ninjaFirstName= parsedResult.Table[0].firstName
              var ninjaLastName = parsedResult.Table[0].lastName
              var ninjaId = parsedResult.Table[0].ninjaId
               var ninjaEmail = parsedResult.Table[0].email
              var ninjaAcceptanceStatus = "Requested"
             
             
              var sql = "UPDATE bookings ";
              sql += "SET ninjaFirstName = '" + ninjaFirstName+ "'"+ ",ninjaLastName= '"+ninjaLastName+"'" 
              sql +=",ninjaId= '"+ninjaId+"'"
              sql += ",ninjaAcceptanceStatus = '" + ninjaAcceptanceStatus + "'"
              sql += "WHERE taskId='"+taskId+"'"
              
               await cloudbackend.sqlExecuteRawQuery(sql)
                    .then((secondResult)=>{   
                        
                        
                    })
                    
                await cloudbackend.sqlSelect("SELECT *, TIME_FORMAT(jobTime,'%h:%i %p' ) AS formatTime, DATE_FORMAT(jobDate, '%W, %M %D, %Y') AS formatDate FROM bookings WHERE taskId= '" +taskId+" ' ")
                    .then(async (thirdResult)=>{
                        
                        var parsedThirdResult = JSON.parse(thirdResult)
                        var firstName = parsedThirdResult.Table[0].firstName
                        var lastName = parsedThirdResult.Table[0].lastName
                       
                        var jobName = parsedThirdResult.Table[0].jobName
                        var category = parsedThirdResult.Table[0].category
                        var subcategory = parsedThirdResult.Table[0].subcategory
                        var jobDate = parsedThirdResult.Table[0].formatDate
                        var jobTime = parsedThirdResult.Table[0].formatTime
                        var userId = parsedThirdResult.Table[0].userId
                        var image = parsedThirdResult.Table[0].image
                        
                        var jobLocation = parsedThirdResult.Table[0].jobLocation
                        var jobDetails = parsedThirdResult.Table[0].jobDetails
                        var locationDetails = parsedThirdResult.Table[0].locationDetails
                        var clientSuggestedPrice = parsedThirdResult.Table[0].clientSuggestedPrice
                        var currency = parsedThirdResult.Table[0].currency
                        var paymentMethod = parsedThirdResult.Table[0].paymentMethod
                        
                        var dateFlexibility = parsedThirdResult.Table[0].dateFlexibility
                        var timeFlexibility = parsedThirdResult.Table[0].timeFlexibility
                        var vehicleRequirments = parsedThirdResult.Table[0].vehicleRequirments
                     
                        
                        await cloudbackend.sqlSelect("SELECT email from users where userId= '" +userId+" ' ")
                        .then(async (fourthResult)=>{ 
                            
                            var parsedfourthResult = JSON.parse(fourthResult)
                            var email = parsedfourthResult.Table[0].email
                            
                            const data = {
                            from: "Task Ninja Bot <ConfirmationBoss@Taskninjaservices.com>",
                        	to: email,
                        	subject: `You asked ${ninjaFirstName} to accept your ${subcategory} job`,
                        	template: "client_chooses_ninja",
                        	'v:ninjaFirstName': ninjaFirstName,
                        	'v:ninjaLastName': ninjaLastName,
                        	'v:category': category,
                        	'v:subcategory': subcategory,
                        
                        	'v:firstName': firstName,
                        	'v:lastName': lastName,
                        	
                        	'v:jobDate': jobDate,
                        	'v:jobTime': jobTime
                        };
                      await mg.messages().send(data, function(error, body) {
                            console.log(body);
                        });
                        
                        // emails the ninja
                       
                            
                            const dataNinja = {
                            from: "Task Ninja Bot <jobs@Taskninjaservices.com>",
                        	to: ninjaEmail,
                        	subject: `${ninjaFirstName}, you have a new ${category} job from ${firstName}`,
                        	template: "ninjareceivesjobrequest-2020-05-11.104719",
                        	'v:ninjaFirstName': ninjaFirstName,
                        	'v:ninjaLastName': ninjaLastName,
                        	'v:category': category,
                        	'v:subcategory': subcategory,
                        
                        	'v:firstName': firstName,
                        	'v:lastName': lastName,
                        	'v:jobDate': jobDate,
                        	
                        	'v:jobLocation': jobLocation,
                        	'v:jobDetails': jobDetails,
                        	'v:locationDetails': locationDetails,
                        	
                        	'v:clientSuggestedPrice': clientSuggestedPrice,
                        	'v:currency': currency,
                        	'v:paymentMethod': paymentMethod,
                        	
                        	'v:dateFlexibility': dateFlexibility,
                        	'v:timeFlexibility': timeFlexibility,
                        	'v:vehicleRequirements': vehicleRequirments,
                        	'v:jobTime': jobTime
                        };
                      await mg.messages().send(dataNinja, function(error, body) {
                            console.log(body);
                        });   
                        })
                     
                    })
                        
                        
                        
                           
                        
                    // })
                     
                     
                         
                   


                    var objReturned = new Object()
                  //  objReturned.userId=ninjaId
                    objReturned.taskId=taskId
                    objReturned.ninjaFirstName=ninjaFirstName
                    objReturned.ninjaLastName=ninjaLastName
                    objReturned.ninjaId=ninjaId
                    callback(null,objReturned)
                    
                    
                    
       })
}
                    
                    
 
   


 function cleanVar(txt) {
        if (txt == null) {
            txt = "";
        }
        return txt.replace(/'/g, "''");
    };