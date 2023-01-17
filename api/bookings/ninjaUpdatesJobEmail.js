var cloudbackend = require('appdrag-cloudbackend');
cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');


var API_KEY = 'bd57f19e0bd238f2c4a861331e2b4b7b-0afbfc6c-9e5951de';
var DOMAIN = 'mail.taskninjaservices.com';

var mg = require('mailgun-js')({
    apiKey: API_KEY,
    domain: DOMAIN
});

 
                        


   exports.handler = async(event, context, callback) => {
    // TODO implement
    var taskId =  cleanVar(event["POST"]["taskId"]) 
    var update =  cleanVar(event["POST"]["update"]) 
    var updateType =  cleanVar(event["POST"]["updateType"]) 
    
      await cloudbackend.sqlSelect("SELECT *, TIME_FORMAT(jobTime,'%h:%i %p' ) AS formatTime, DATE_FORMAT(jobDate, '%W, %M %D, %Y') AS formatDate FROM bookings WHERE taskId= '" +taskId+" ' ")
       .then(async (result)=>{
                        
                        var parsedresult = JSON.parse(result)
                        var firstName = parsedresult.Table[0].firstName
                        var lastName = parsedresult.Table[0].lastName
                       
                        var jobName = parsedresult.Table[0].jobName
                        var category = parsedresult.Table[0].category
                        var subcategory = parsedresult.Table[0].subcategory
                        var jobDate = parsedresult.Table[0].formatDate
                        var jobTime = parsedresult.Table[0].formatTime
                        var userId = parsedresult.Table[0].userId
                        var image = parsedresult.Table[0].image
                        
                        var jobLocation = parsedresult.Table[0].jobLocation
                        var jobDetails = parsedresult.Table[0].jobDetails
                        var locationDetails = parsedresult.Table[0].locationDetails
                        var clientSuggestedPrice = parsedresult.Table[0].clientSuggestedPrice
                        var currency = parsedresult.Table[0].currency
                        var paymentMethod = parsedresult.Table[0].paymentMethod
                        
                        var dateFlexibility = parsedresult.Table[0].dateFlexibility
                        var timeFlexibility = parsedresult.Table[0].timeFlexibility
                        var vehicleRequirments = parsedresult.Table[0].vehicleRequirments
                        var ninjaFirstName = parsedresult.Table[0].vehicleRequirments
       
                        
    await cloudbackend.sqlSelect("SELECT email from users where userId= '" +userId+" ' ")
                        .then(async (secondResult)=>{ 
                            
                            var parsedSecondResult = JSON.parse(secondResult)
                            var email = parsedSecondResult.Table[0].email
    
    const data = {
    from: "Task Ninja Bot <jobupdate@taskninjaservices.com>",
	to: email,
	subject: `${firstName}, ${ninjaFirstName} has updated your Task's ${updateType}`,
	template: "ninjaupdatestask",
	'v:ninjaFirstName': ninjaFirstName,
	'v:firstName': firstName,
	'v:category': category,
	'v:updateType': updateType,
	'v:update': update,
	'v:jobDate': jobDate,
	'v:jobTime': jobTime,
	'v:jobLocation': jobLocation
	
};

mg.messages().send(data, function(error, body) {
    console.log(body);
});
});
});

    callback(null, 'Hello from CloudBackend');
};


 function cleanVar(txt) {
       if (txt == null) {
           txt = "";
       }
       return txt.replace(/'/g, "''");
   }