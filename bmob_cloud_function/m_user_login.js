function onRequest(request, response, modules) {
    var db = modules.oData;
    var Bql = modules.oBql;
    var httpType = request.method;
    var utdid;
    var imei;
    var imei0;
    var imei1;
    var objectId;
    var version;
    var vaid;
    var uuid;
   if ("GET" == httpType) {
       utdid = request.query.utdid;
       objectId = request.query.objectId;
       vaid = request.query.vaid;
       imei0 = request.query.imei0;
       imei1 = request.query.imei1;
       imei = request.query.imei;
       uuid = request.query.uuid;
       version= request.query.version;
   }else {
       utdid = request.body.utdid;
       objectId = request.body.objectId;
       vaid = request.body.vaid;
       imei0 = request.body.imei0;
       imei1 = request.body.imei1;
       imei = request.body.imei;
       uuid = request.body.uuid;
       version = request.body.version;
   };
   
//   if (vaid == undefined) vaid = null;
//   if (imei == undefined) imei = null;
//   if (imei0 == undefined) imei0 = null;
//   if (imei1 == undefined) imei1 = null;
//   if (uuid == undefined) uuid = null;
    //response.end("vaid = " + vaid);
   //response.end("objectId = " + objectId);
   //var imei = "862258033704520#862258033704538";
   var likes = "%"+imei+"%";
   var sql =  "select * from VipInfo where utdid=?"  + " or IMEI like " + likes;
   var sql2 = "select * from GoogleWhiteList where utdid=?"  + " or IMEI like " + likes + " order by updatedAt desc limit 1";
    db.findOne({
    "table":"VipInfo",
    "objectId":objectId
   },function(err,data){
     // response.end("err = " + err);
      var dataObject= JSON.parse(data);
      if(dataObject.error == null){
            if (dataObject.utdid == "002") {
                response.send("002");
            } 
            if (dataObject.utdid == utdid ||
                (dataObject.valid != null && dataObject.valid == vaid) ||  
                (dataObject.imei0 != null && dataObject.imei0 == imei0) ||
                (dataObject.imei1 != null && dataObject.imei1 == imei1)) {
                    var day = dataObject.day;
                    var month = dataObject.month;
                    let moment = modules.oMoment;
                    let previosDate = moment().subtract(day, 'days').subtract(month, 'months');      
                    // moment().add(3, 'days').calendar();       // 下星期四14:38
                    // moment().add(10, 'days').calendar();      // 2021/10/28
                    let previosDateStr = previosDate.format('YYYY-MM-DD HH:mm:ss');
                    if (previosDateStr < dataObject.createdAt ) { //在有效期内
                       //response.end("still in valid date");
                        var functions = modules.oFunctions;
                       
                        functions.run({
                           "name": "update_user",
                            "data":{"objectId":objectId,"utdid":utdid,"uuid":uuid,"imei0":imei0,"imei1":imei1,"imei":imei,"version":version,"vaid":vaid}
                        },function(err,data){
                           //回调函数
                           response.send(data);
                        });
                      
                       //update
                    }else {
                      response.end("expire ,date = " + previosDateStr);
                    }
                
            }else {
                //check fail
                response.send("002");
            }
           
          
      }else { //没有找到记录
            response.end("match null");
      }
     
     
     
  });
  
//   //response.end("sql="+sql);
//   Bql.exec({
//       "bql":sql,
//       "values":"[\""+utdid+"\"]"
//     },function(err,data){
//         var resultObject = JSON.parse(data);
//         for(var results in resultObject)
//           {
//             var resultArr = resultObject[results];
//             if (JSON.stringify(resultArr) == '[]') {
//                   //response.end("is null");
//                   Bql.exec({
//                       "bql":sql2,
//                       "values":"[\""+utdid+"\"]"
//                     },function(err,data){
//                         let moment = modules.oMoment
//                         let time = moment().format('YYYY-MM-DD HH:mm:ss');
                        
//                         var resultObject = JSON.parse(data);
//                         for (var results in resultObject) {
//                             var resultArr = resultObject[results];
//                              if (JSON.stringify(resultArr) == '[]') {
//                                  response.send("{\"result\":3}"); //不再白名单也不再黑名单
//                              }else { //exist white list
//                                   for(var oneline in resultArr){
//                                       let expireTime = resultArr[oneline].expireDate.iso;
//                                       if (expireTime < time) {
//                                          // response.end ("< current date")
//                                           response.send("{\"result\":4}"); //白名单，已经过期了
//                                       }else {
//                                           response.send("{\"result\":5}"); //白名单，有效中
//                                       }
//                                       //response.end("expireTime = " + expireTime );
//                                       //response.send("{\"result\":2}");
//                                       break;
//                                     }
                                 
//                              }
                             
//                         }
                        
//                       // let expireTime = data.
//                         //response.end(time);
//                          response.send(data);
//                     });
                    
//             }else {
//                 response.send("{\"result\":1}"); //黑名单
//             }
//             // var str =" ";
//             // //遍历得到的每行结果
//             // for(var oneline in resultArr){
//             //   str =str +" " + resultArr[oneline].utdid;
//             // }
//             // response.send(str);
//           }
        //response.end("result = " + resultObject);
        // if (resultObject == "[]") {
        //     response.end("is null")
        // }else {
        //     response.end("is not null")
        // }
        //for(var results in resultObject)
        // if(Array.prototype.isPrototypeOf(data)
        // if (data != null)
        //     response.send(data);
        // else
        //   response.send("null");  
     //回调函数
//    });
    
//     db.find({
//     "table":"GoogleBlackList",
//     "where":{"utdid":utdid}
//   },function(err,data){
}                                                                                    