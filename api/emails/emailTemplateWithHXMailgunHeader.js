var cloudbackend = require('appdrag-cloudbackend');
cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');


var API_KEY = 'bd57f19e0bd238f2c4a861331e2b4b7b-0afbfc6c-9e5951de';
var DOMAIN = 'mail.taskninjaservices.com';

var mg = require('mailgun-js')({
    apiKey: API_KEY,
    domain: DOMAIN
});




   exports.handler = (job, context, callback) => {
    // TODO implement
    
    var email = cleanVar(job["POST"]["email"]);
   const data = {
   from: "Task Ninja Customer Support <welcome@taskninjaservices.com>",
	to: email,
	subject: "Welcome to Task Ninja!! to Task Ninja",
	template: "newemail-2020-05-09.182916",
	'h:X-Mailgun-Variables':'{"name": "konnie"}'
};

mg.messages().send(data, function(error, body) {
    console.log(body);
});

    callback(null, 'Hello from CloudBackend');
};


 function cleanVar(txt) {
       if (txt == null) {
           txt = "";
       }
       return txt.replace(/'/g, "''");
   }