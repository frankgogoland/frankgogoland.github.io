function onRequest(request, response, modules) {
    var db = modules.oData;
    var Bql = modules.oBql;
    var httpType = request.method;
    var mcc;
   if ("GET" == httpType) {
       aa = request.query.aa;
   }else {
       aa =  request.body.aa;
   }
   mcc = aa;
  var _result = {
      "code":"", //错误码,A001,A002,A003,A003,A004,A005,A1024
      "aa":"", //info
  };
  
   var sql =  "select * from NRBands where mcc=?";
   Bql.exec({
      "bql":sql,
       "values":"[\""+mcc+"\"]"
    },function(err,data){
        var resultObject = JSON.parse(data);
        for(var results in resultObject)
         {
            var resultArr = resultObject[results];
            if (JSON.stringify(resultArr) == '[]') {
                break;
            }else {
                  for(var oneline in resultArr){
                      var bands = resultArr[oneline].bands;
                      _result.code="A102";
                      _result.aa = bands;
                      _result.bb = resultArr[oneline].name ;
                      response.send(_result); //白名单，有效中
                      return;
                }
                    
            }
          break;
        }
         _result.code="A100";
          response.send(_result);//找不到记录
    });
}