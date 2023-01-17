exports.handler = (event, context, callback) => {
    
    // Query String (GET) Parameters
    var parameters = event["GET"]["parameters"];
   
    
   
    
    // Returning the string
    callback(null, parameters);
};