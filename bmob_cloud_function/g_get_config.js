function onRequest(request, response, modules) {
    var db = modules.oData;
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
   db.findOne({
      "table":"Limit",
      "objectId":"tTrF999A"
     },function(err,data){
        var dataObject = JSON.parse(data);
        if (dataObject === undefined) {
            _result.code = "A002";
            _result.info = "could not find record";
            response.send(_result);
        }        
        else if(dataObject.error === undefined){
            response.send(dataObject);
        }
        else { //没有找到记录
            _result.code = "A002";
            _result.info = dataObject.error;
            response.send(_result);
              
        }
       
       
       
    });
  }                                                                                    