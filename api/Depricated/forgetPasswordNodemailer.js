var cloudbackend = require('appdrag-cloudbackend');
const nodemailer = require('nodemailer');
cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');
var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "b0142636b8d083",
        pass: "f6538a9999b92f"
    }
});

exports.handler = async(event, context, callback) => {

    // 1) Receive the email parameter
    var email = cleanVar(event["POST"]["email"]);

    await cloudbackend.sqlSelect("SELECT * FROM users WHERE email = '" + email + "'")
    .then(async function(response) {
        
        // 3) Return an error object 
        var result = JSON.parse(response);
        if (result == null || result.Table == null) {
            var objReturned = new Object();
            objReturned.error = "EMAIL_NOT_FOUND";
            callback(null, objReturned);
        } else {
            // 4) Create the email variables
            var firstName = result.Table[0].firstName;
            var password = result.Table[0].password;
            var fromAddress = "konradhylton@gmail.com";
            var subject = "It looks like you forgot your password";
            var messageDetails = "Hey " + firstName + ", your password is: " + password;
            
            const message = {
              from: fromAddress, // Sender address
              to: email, // List of recipients
              subject: subject, // Subject line
              text: messageDetails // Plain text body
};
            // 5) Send out the email
            // i am not sure if the await and error handling is done correctly. Okay it isn't done right. If the email nuh send, it still ago say success. 
            // and that' because nodemailr and cloudbackedssend email handle it differently. Soi need to wrap my head around this and figure it out. 
            await transport.sendMail(message, function(err, info) {
                 if (err) {
                    console.log(err)
                } else {
                    console.log("success");
                }
            });
           
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




/*

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
                // 4) Create the email variables
                var firstName = result.Table[0].firstName;
                var password = result.Table[0].password;
                var fromAddress = "konradhylton@gmail.com";
                var subject = "It looks like you forgot your password";
                var message = "Hey " + firstName + ", your password is: " + password;
                // 5) Send out the email
                await cloudbackend.sendEmail(fromAddress, "Password Admin", email, subject, message, false)
                    .then(function(response) {
                        console.log(response);
                    });
                // 6) Return a success response
                var objReturned = new Object();
                objReturned.success = "PASSWORD_SENT";
                callback(null, objReturned);
            }
        });
    };
} */