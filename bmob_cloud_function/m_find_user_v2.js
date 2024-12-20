/*
 会员vip图标点4下查找用户，并激活会员
返回结果
{
    "code": "A1024",
    "info": "",
    "createdAt": "2023-03-08 11:26:21",
    "updatedAt": "",
    "expireDate": "2023-03-09 11:26:21",
    "objectId": "9b080b3b74",
    "utdid": "",
    "uuid": "c7ef3893-7776-d191-a275-421e2aa6c0a2"
}
*/
function onRequest(request, response, modules) {
  var db = modules.oData;
  var gzip = modules.oGzip;
  var httpType = request.method;
  var functions = modules.oFunctions;
  var _result = {
      "code":"", //错误码,A001,A002,A003,A003,A004,A005,A1024
      "info":"",
      "createdAt":"", //创建日期
      "updatedAt":"",  //更新日期
      "expireDate":"", //过期日期
      "objectId":"",   //对象属性
      "utdid":"",
      "uuid":""
  };
   if ("GET" == httpType) {
      _result.code = "A005";
      _result.objectId = objectId;
      _result.info = "method does not support";
      response.send(Buffer.from(JSON.stringify(_result),'utf-8').toString('base64'));
   }else {
       //objectId = request.body.objectId;
       body = request.body.data;
       var gzipedData = Buffer.from(body, "base64");
       gzip.ungzip(gzipedData).then( (decompressed) => {
       //   response.end(decompressed.toString()); 
       var dataObject= JSON.parse(decompressed.toString());
       
       //response.send(Buffer.from(JSON.stringify(dataObject),'utf-8').toString('base64'));
        
       functions.run({
                  "name": "m_find_user",
                  "data":{"vaid":dataObject.aa,"imei0":dataObject.bb,"imei1":dataObject.cc,
                   "utdid":dataObject.dd
                  }
                },function(err,data){
                      var dataObject= JSON.parse(data);
                      response.send(Buffer.from(JSON.stringify(dataObject),'utf-8').toString('base64'));
                });
                    
       
       });
     
   }
 
}