var cloudbackend = require('appdrag-cloudbackend');
cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');


 
    var API_KEY = 'bd57f19e0bd238f2c4a861331e2b4b7b-0afbfc6c-9e5951de';
    var DOMAIN = 'mail.taskninjaservices.com';

    var mg = require('mailgun-js')({
        apiKey: API_KEY,
        domain: DOMAIN
    });



//Find booking ID in the url then find the Ninja ID based on user id in local storage.  If someone was to manipulate their user id then the shit just wouldn't work. 
//And that actually is a good thing. You can't really guess a user id, though you could guess an email.


//super important


 exports.handler = async(event, context, callback) => {
         var ninjaId = cleanVar(event["POST"]["ninjaId"]);
         var taskId =  cleanVar(event["POST"]["taskId"])

         await cloudbackend.sqlSelect("SELECT * from users where ninjaId= '" +ninjaId+" ' ") //change
                .then(async (result)=>{
                      
                      var parsed_result = JSON.parse(result)
                      var ninja_first_name = parsed_result.Table[0].firstName
                      var ninjaLastName=parsed_result.Table[0].lastName
                      var ninjaId=parsed_result.Table[0].ninjaId
                      
                      
                      var ninjaFirstName = ninja_first_name
                      var ninjaAcceptanceStatus = "Accepted"
                      
                      var sql = "UPDATE bookings "; 
                      sql += "SET ninjaFirstName = '" + ninja_first_name + "'"
                      sql += ",ninjaLastName = '" + ninjaLastName + "'"
                      sql += ",ninjaId = '" + ninjaId + "'"
                      sql += ",jobAccepted = NOW() "
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
                        var imagePath = parsedThirdResult.Table[0].image
                        var image = `https:${imagePath}`
                        
                        await cloudbackend.sqlSelect("SELECT * from users where userId= '" +userId+" ' ")
                        .then(async (fourthResult)=>{ 
                            
                            var parsedfourthResult = JSON.parse(fourthResult)
                            var email = parsedfourthResult.Table[0].email
                            var address = parsedfourthResult.Table[0].address
                            
                            const data = {
                            from: "Task Ninja <ConfirmationBoss@Taskninjaservices.com>",
                        	to: email,
                        	subject: `${ninjaFirstName} ${ninjaLastName} accepted your ${category} job`,
                        	template: "ninjaseclectedjob",
                        	'v:ninjaFirstName': ninjaFirstName,
                        	'v:ninjaLastName': ninjaLastName,
                        	'v:category': category,
                        	'v:subcategory': subcategory,
                        	'v:taskId': taskId,
                        	'v:firstName': firstName,
                        	'v:lastName': lastName,
                        	'v:address': address,
                        	'v:image': image,
                        	'v:estimatedJobPrice': 'N/A',
                        	'v:gct': 'N/A',
                        	'v:estimatedTotal': 'N/A',
                        	'v:estimatedSubTotal': 'N/A',
                        	'v:jobDate': jobDate,
                        	'v:jobTime': jobTime
                        	
                        };
                      await mg.messages().send(data, function(error, body) {
                            console.log(body);
                            
                        });
                        
                            
                        })
                     
                    })
                        
                        
                    
                    
                    
                    var objReturned = new Object()
                    objReturned.ninjaId=ninjaId 
                    objReturned.taskId=taskId  
                    objReturned.ninjaFirstName=ninja_first_name
                    //objReturned.allInfo=parsed_result.Table[0] //everything and the kitchen sink, nahh maybe too much info. Even for a beta
                    callback(null,objReturned)
                })
        }

 function cleanVar(txt) {
        if (txt == null) {
            txt = "";
        }
        return txt.replace(/'/g, "''");
    };