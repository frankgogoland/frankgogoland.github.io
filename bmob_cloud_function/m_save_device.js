function onRequest(request, response, modules) {
    var db = modules.oData;
    var httpType = request.method;
    var phoneModel;
    var vendor;
    var version;
   if ("GET" == httpType) {
       vendor = request.query.aa;
       phoneModel = request.query.bb;
    
    }else {
       vendor = request.body.aa;
       phoneModel = request.body.bb;
    }
    
       
   var _result = {
       "code":"", //错误码,A001,A002,A003,A003,A004,A005,A1024
       "info":"",
       "createdAt":"", //创建日期
   };
   
  db.insert({
    "table":"SupportPhone",
    "data":{"vendor":vendor,"type":phoneModel,"imei":""}
  },function(err,data){
      var dataObject= JSON.parse(data);
      if (dataObject.code !== undefined){ //插入数据错误
          _result.code = "A005";
          _result.info = dataObject.error;
          response.send(_result);
      }else { 
          _result.code = "A1024";
          _result.objectId = dataObject.objectId;
          _result.createdAt = dataObject.createdAt;
          response.send(_result);
      }
  });
  
//  var sql = "select * from SupportPhone where vendor like " + vendor + " and phone like " + phone_type;
//  Bql.exec({
//      "bql":sql
     
//  },function(err,data){
//     var resultObject = JSON.parse(data);
//      for(var results in resultObject)
//       {
//         var resultArr = resultObject[results];
//         if (JSON.stringify(resultArr) == '[]') {
//           _result.code = "A002";
//           _result.info =  "could not found record";
//           response.send(_result);
//         }
//         break;
//       }
//   });
  
}