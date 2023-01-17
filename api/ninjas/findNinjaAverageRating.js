var cloudbackend = require('appdrag-cloudbackend');
cloudbackend.init('0516c028-34d4-44e3-b221-8c47d4a77b4d', 'Task-Ninja-69a87b');


exports.handler = async (event, context, callback) => {
    var ninjaId= cleanVar(event["POST"]["ninjaId"]);
   
 
    await cloudbackend.sqlSelect("SELECT rating from bookings where ninjaId= '" +ninjaId+" ' ") 
       .then(async (result)=>{
              var parsedResult = JSON.parse(result)
              var allRatings= parsedResult.Table
              console.log(allRatings)
              var quantity = allRatings.length
              var divider = 0
              
              var sum=0
            
              for (x = 0; x < quantity; x++){
                 if(allRatings[x].rating!=0&&allRatings[x].rating!=null){
                  sum+=allRatings[x].rating
                  divider++
                 }
              } 
           
             var average = sum/divider
              
            
                    
                    var objReturned = new Object() 
                    objReturned.average=average
                    callback(null,objReturned)
                    
       })
}
                    
                    
 
   


 function cleanVar(txt) {
        if (txt == null) {
            txt = "";
        }
        return txt.replace(/'/g, "''");
    };