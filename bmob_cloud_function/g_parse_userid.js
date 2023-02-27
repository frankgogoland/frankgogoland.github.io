function onRequest(request, response, modules) {
    var db = modules.oData;
     var Bql = modules.oBql;
    var httpType = request.method;
    var utdid;
    var imei;
   if ("GET" == httpType) {
       utdid = request.query.utdid;
       var imei0 =  request.query.imei0;
       var imei1 = request.query.imei1;
       if (imei0.length >= 15) imei = imei0;
       else if (imei1.length >= 15) imei = imei1;
       else imei= "undefined"
   }else {
       utdid = request.body.utdid;
       var imei0 =  request.body.imei0;
       var imei1 = request.body.imei1;
       if (imei0.length >= 15) imei = imei0;
       else if (imei1.length >= 15) imei = imei1;
       else imei= "undefined"
   };
   //var imei = "862258033704520#862258033704538";
   var likes = "%"+imei+"%";
   var sql =  "select * from GoogleBlackList where utdid=?"  + " or IMEI like " + likes;
   var sql2 = "select * from GoogleWhiteList where utdid=?"  + " or IMEI like " + likes + " order by updatedAt desc limit 1";
   //response.end("sql="+sql);
   Bql.exec({
      "bql":sql,
       "values":"[\""+utdid+"\"]"
    },function(err,data){
        var resultObject = JSON.parse(data);
        for(var results in resultObject)
          {
            var resultArr = resultObject[results];
            if (JSON.stringify(resultArr) == '[]') {
                  //response.end("is null");
                  Bql.exec({
                      "bql":sql2,
                       "values":"[\""+utdid+"\"]"
                    },function(err,data){
                        let moment = modules.oMoment
                        let time = moment().format('YYYY-MM-DD HH:mm:ss');
                        
                        var resultObject = JSON.parse(data);
                        for (var results in resultObject) {
                            var resultArr = resultObject[results];
                             if (JSON.stringify(resultArr) == '[]') {
                                 response.send("{\"result\":3}"); //不再白名单也不再黑名单
                             }else { //exist white list
                                  for(var oneline in resultArr){
                                      let expireTime = resultArr[oneline].expireDate.iso;
                                      if (expireTime < time) {
                                         // response.end ("< current date")
                                          response.send("{\"result\":4}"); //白名单，已经过期了
                                      }else {
                                          response.send("{\"result\":5}"); //白名单，有效中
                                      }
                                      //response.end("expireTime = " + expireTime );
                                      //response.send("{\"result\":2}");
                                      break;
                                    }
                                 
                             }
                             
                        }
                        
                       // let expireTime = data.
                        //response.end(time);
                         response.send(data);
                    });
                    
            }else {
                response.send("{\"result\":1}"); //黑名单
            }
            // var str =" ";
            // //遍历得到的每行结果
            // for(var oneline in resultArr){
            //   str =str +" " + resultArr[oneline].utdid;
            // }
            // response.send(str);
          }
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
    });
    
//     db.find({
//     "table":"GoogleBlackList",
//     "where":{"utdid":utdid}
//   },function(err,data){
//       //将返回结果转换为Json对象
//      response.send ("data: " + data);
//   });
}                                                                                    