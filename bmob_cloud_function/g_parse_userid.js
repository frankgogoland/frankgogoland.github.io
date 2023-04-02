/*
 分析白名单，黑名单的分析
 */ 
 function onRequest(request, response, modules) {
    var db = modules.oData;
    var Bql = modules.oBql;
    var httpType = request.method;
    var utdid;
    var imei;
   if ("GET" == httpType) {
       utdid = request.query.utdid;
       imei = request.query.imei;
   }else {
       utdid = request.body.utdid;
       imei =  request.body.imei;

  }
 if( imei === undefined || imei === null)
    imei= "undefined12345678"
 if( utdid === undefined || utdid === null)
    utdid= "undefined12345678"
        
  var _result = {
      "code":"", //错误码,A001,A002,A003,A003,A004,A005,A1024
      "info":"",
      "member_type":"",
      "createdAt":"", //创建日期
      "updatedAt":"",  //更新日期
      "expireDate":"", //过期日期
      "objectId":"",   //对象属性
      "utdid":"",
      "uuid":""
  };
   //var imei = "862258033704520#862258033704538";
   var likes = "%"+imei+"%";
   var sql =  "select * from GoogleBlackList where utdid=?"  + " or IMEI like " + likes + " order by updatedAt desc limit 1";
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
                        var moment = modules.oMoment
                        var time = moment().format('YYYY-MM-DD HH:mm:ss');
                        var resultObject = JSON.parse(data);
                        for (var results in resultObject) {
                            var resultArr = resultObject[results];
                             if (JSON.stringify(resultArr) == '[]') {
                                 _result.code = "A100"
                                 response.send(_result); //不再白名单也不再黑名单
                             }else { //exist white list
                                  for(var oneline in resultArr){
                                      var expireTime = resultArr[oneline].expireDate.iso;
                                      if (expireTime < time) {
                                         // response.end ("< current date")
                                         _result.code="A101"
                                          response.send(_result); //白名单，已经过期了
                                      }else {
                                          _result.code="A102";
                                          _result.member_type = resultArr[oneline].member_type;
                                          _result.expireDate =  resultArr[oneline].expireDate.iso;
                                          response.send(_result); //白名单，有效中
                                      }
                                      break;
                                    }
                                 
                             }
                          break;
                        }
                    });
                    
            }else {
                  _result.code = "A103"
                  response.send(_result); //黑名单
            }
            break;
          }
    
    });
    
}                                                                                    