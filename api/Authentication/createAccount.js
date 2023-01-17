    var cloudbackend = require('appdrag-cloudbackend');
    cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');
    const uuid = require('uuid');


    var API_KEY = 'bd57f19e0bd238f2c4a861331e2b4b7b-0afbfc6c-9e5951de';
    var DOMAIN = 'mail.taskninjaservices.com';

    var mg = require('mailgun-js')({
        apiKey: API_KEY,
        domain: DOMAIN
    });


    // Executed on every API call 
    exports.handler = async(event, context, callback) => {
        // 1) Reading posted parameters
        var firstName = cleanVar(event["POST"]["firstName"]);
        var lastName = cleanVar(event["POST"]["lastName"]);
        var email = cleanVar(event["POST"]["email"]);
        var password = cleanVar(event["POST"]["password"]);
        var phone = cleanVar(event["POST"]["phone"]);
        var address = cleanVar(event["POST"]["address"]);
        // 2) Search the database for existing email
        await cloudbackend.sqlSelect("SELECT * FROM users WHERE email = '" + email + "'")
        .then(async function(response) {
            var result = JSON.parse(response);
            if (result != null && result.Table != null) {
                // already exists
                var objReturned = new Object();
                objReturned.error = "EMAIL_ALREADY_USED";
                callback(null, objReturned);
            } else {
                // 3) Generate a new unique ID for the token
                var newToken = uuid.v4();
                var userId = uuid.v4(); // another update
                // 4) Insert the values into our users table
                var sql = "INSERT INTO users (userId, firstName, lastName, phone, email, password, token, address, lastUpdated, createdAt, lastLogin) "; // several to update here
                sql += "VALUES ('" + userId + "',    '" + firstName + "', '" + lastName + "', '" + phone + "', '" + email + "', '" + password + "', '" + newToken + "','" + address + "', NOW(), NOW(), NOW());";
                await cloudbackend.sqlExecuteRawQuery(sql).then(function(response) {
                    console.log(response);
                });

                //5 Send of an email
              
                const data = {
                    from: "Konrad Hylton from Task Ninja <ceo@taskninjaservices.com>",
                    to: email,
                    subject: "Welcome to Task Ninja",
                    template: "newemail-2020-05-09.182916"
                };
                mg.messages().send(data, function(error, body) {
                    console.log(body);
                });


                // 6) Return the resulting object 
                var objReturned = new Object();
                objReturned.email = email;
                objReturned.token = newToken;
                objReturned.userId = userId; //update
                objReturned.firstName = firstName;
                callback(null, objReturned);
            }
        });
    }

    function cleanVar(txt) {
        if (txt == null) {
            txt = "";
        }
        return txt.replace(/'/g, "''");
    };