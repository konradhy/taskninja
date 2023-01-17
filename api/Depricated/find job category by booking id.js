var cloudbackend = require('appdrag-cloudbackend');
cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');

exports.handler = (event, context, callback) => {
    //First select the jobId from the booking row where jobid = jobId
    const bookingId= event["POST"]["bookingId"]
    
    cloudbackend.sqlSelect("SELECT * FROM bookings WHERE Id = "+bookingId)
    .then( function(response) {
        var parseBookingResponse = JSON.parse(response)
        var relevantBooking = parseBookingResponse.Table[0]
        var jobId = relevantBooking.jobId
         console.log(jobId);
        
        cloudbackend.sqlSelect("SELECT * FROM jobs WHERE Id = "+jobId)
         .then( function(response) {
             var parseJobResponse = JSON.parse(response)
             var relevantJob = parseJobResponse.Table[0]
             var jobCategory = relevantJob.category
             console.log(jobCategory)
         })
         
        console.log(jobId);
    })
    callback(null, 'Hello from CloudBackend');
    const category = event["PUT"][jobCategory]
};