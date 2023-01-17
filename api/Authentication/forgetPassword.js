var cloudbackend = require('appdrag-cloudbackend');
var generatePassword = require('password-generator')
cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');
    
    
    var API_KEY = 'bd57f19e0bd238f2c4a861331e2b4b7b-0afbfc6c-9e5951de';
    var DOMAIN = 'mail.taskninjaservices.com';
     var newPassword = generatePassword(8,true,null,'44')

    var mg = require('mailgun-js')({
        apiKey: API_KEY,
        domain: DOMAIN
    });
    
    
    exports.handler = async(event, context, callback) => {
        
 
         var link = "https://www.taskninjaservices.com/updateUserProfile"
      
        // 1) Receive the email parameter
        var email = cleanVar(event["POST"]["email"]);
        // 2) Ensure the email exists in the database
        
        
        await cloudbackend.sqlSelect("SELECT * FROM users WHERE email = '" + email + "'")
        .then(async function(response) {
            console.log(response);
            
            
            // 3) Return an error object 
            
            var result = JSON.parse(response);
            
            if (result == null || result.Table == null) {
                var objReturned = new Object();
                objReturned.error = "EMAIL_NOT_FOUND";
                callback(null, objReturned);
            } else {
                
                
                var sql = "UPDATE users ";
                sql += "SET password = '" +newPassword+ "'"
                sql += "WHERE email= '"+email+"'"
                
                await cloudbackend.sqlExecuteRawQuery(sql)
                                .then((secondResult)=>{   
                                    
                                    
                                })
                                
               
                
                // 4) Create the email variables
                var firstName = result.Table[0].firstName;
                var password = result.Table[0].password;
                
                var fromAddress = "konradhylton@gmail.com";
                var subject = "It looks like you forgot your password";
                var message = `Hey ${firstName}, your new password is ${newPassword}. `
                message += `I know that's super confusing, so click here ${link} to update your password.`
                message += `If you didn't request a new password then please reply to this email immediately.`
               
                
                    const data = {
                            from: "Password Ninja <forgotpassword@Taskninjaservices.com>",
                        	to: email,
                        	subject: `Hey ${firstName} did you forget your password?`,
                        	text: message
                            
                        
                        
                    };
                      await mg.messages().send(data, function(error, body) {
                            console.log(body);
                        });
                        
                        	
                // 5) Send out the email
              
                // 6) Return a success response
                var objReturned = new Object();
                objReturned.success = "PASSWORD_SENT";
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