/*
更新GoogleVipInfo会员信息表
*/
function onRequest (request, response, modules) {
    var db = modules.oData;
    var Bql = modules.oBql;
    var httpType = request.method;
    var objectId;
    var utdid;
    var imei;
    var version;
    var phoneModel;
    var serviceCodeUpdate;
    
   if ("GET" == httpType) {
       objectId = request.query.objectId;
       serviceCodeUpdate = request.query.serviceCodeUpdate;
       utdid = request.query.utdid;
       imei = request.query.imei;
       version = request.query.version;
       phoneModel = request.query.phoneModel;
     
   }else {
       objectId = request.body.objectId;
       serviceCodeUpdate = request.body.serviceCodeUpdate;
       utdid = request.body.utdid;
       imei = request.body.imei;
       version = request.body.version;
       phoneModel = request.body.phoneModel;
   }
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
  //  response.end("vaid = " + vaid);
   if (vaid === undefined) vaid = null;
   if (imei === undefined) imei = null;
   if (uuid === undefined) uuid = null;
   if (version === undefined) version = null;


  db.update({
    "table":"GoogleVipInfo",
    "objectId":objectId,
    "data":{"utdid":utdid,"imei":imei,"version":version,"serviceCodeUpdate":serviceCodeUpdate}
  },function(err,data){
        response.send(data); // {"updatedAt":"2023-03-05 15:14:58"}
  });
}