function onRequest(request, response, modules) {
  var db = modules.oData;
  var httpType = request.method;
  var imei;
  var imei0;
  var imei1;
  var vaid;
  var version;
  var uuid;
  var utdid;
  var objectId; 
   if ("GET" == httpType) {
       objectId = request.query.objectId;
       vaid = request.query.vaid;
       imei0 = request.query.imei0;
       imei1 = request.query.imei1;
       imei = request.query.imei;
       version = request.query.version;
       uuid = request.query.uuid;
       utdid = request.query.utdid;

   }else {
       objectId = request.body.objectId;
       vaid = request.body.vaid;
       imei0 = request.body.imei0;
       imei1 = request.body.imei1;
       imei = request.body.imei;
       version = request.body.version;
       uuid = request.body.uuid;
       utdid = request.body.utdid;
   }
  //  response.end("vaid = " + vaid);
   if (vaid === 'undefined') vaid = null;
   if (imei === 'undefined') imei = null;
   if (imei0 === 'undefined') imei0 = null;
   if (imei1 === 'undefined') imei1 = null;
   if (uuid === 'undefined') uuid = null;
   if (version === 'undefined') version = null;
   
   //response.end("vaid = " + vaid);
   
  db.update({
    "table":"VipInfo",
    "objectId":objectId,
    "data":{"utdid":utdid,"uuid":uuid,"imei0":imei0,"imei1":imei1,"imei":imei,"version":version,"vaid":vaid}
  },function(err,data){
      if (err == null)
        response.send("response = " + data);
      else
        response.send(err);
  });
}                                                                                    