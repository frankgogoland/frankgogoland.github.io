function onRequest(request, response, modules) {
  var db = modules.oData;
  var httpType = request.method;
  var package_name;
  var objectId;
  if ("GET" == httpType) {
       package_name = request.query.aa;

   }else {
       package_name =  request.body.aa;
       if (package_name !== undefined) {
            package_name =  Buffer.from(package_name, 'base64').toString('utf-8');
       }
  }
  if (package_name === 'make.more.r2d2.google.cellular_pro') {
        objectId = 'tTrF999A';
   
    }else {
         objectId = 'XZA6lllL'; //make.more.r2d2.play.cellular_pro
    }
  var _result = {
      "code":"", //错误码,A001,A002,A003,A003,A004,A005,A1024
      "info":"",
      "rr":"", //price
      "gg":"", //minVersionCode
      "oo":"", //speed test url
      "ee":"",   //orderPrefix
      "pp":"",  //supportNewNrLockVer
      "ss":"",  //web_rul 
      "uuid":""
  };
 db.findOne({
    "table":"GooglePlayLimit",
    "objectId":objectId
   },function(err,data){
      var dataObject = JSON.parse(data);
      if (dataObject === undefined) {
          _result.code = "A001";
          _result.info = "could not find record";
         response.send(Buffer.from(JSON.stringify(_result),'utf-8').toString('base64'));

      }        
      else if(dataObject.error === undefined){
          _result.code = "A102";
          _result.rr = dataObject.price;
          _result.aa = dataObject.lockAdSupport;
          _result.gg = dataObject.minVersionCode;
          _result.oo = dataObject.speedTestCustomURL;
          _result.ee = dataObject.orderPrefix;
          _result.pp = dataObject.supportNewNrLockVer;
          _result.ss = dataObject.web_url;
          _result.vv = dataObject.ossKey;
          _result.ww = dataObject.ossPwd;
          _result.zz = dataObject.auditingVersion;
          _result.tt = dataObject.memCheckKeywords;
          _result.uu = dataObject.config_obj;
          response.send(Buffer.from(JSON.stringify(_result),'utf-8').toString('base64'));
 //         response.send(_result);
      }
      else { //没有找到记录
          _result.code = "A002";
          _result.info = dataObject.error;
           response.send(Buffer.from(JSON.stringify(_result),'utf-8').toString('base64'));
            
      }
     
     
     
  });
}