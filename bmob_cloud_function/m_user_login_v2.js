function onRequest(request, response, modules) {
  var db = modules.oData;
  var gzip = modules.oGzip;
  var httpType = request.method;
  var functions = modules.oFunctions;

   if ("GET" == httpType) {
      _result.code = "A005";
      _result.objectId = "";
      _result.info = "not supported";
      response.send(_result);
   }else {
       body = request.body.data;
       var gzipedData = Buffer.from(body, "base64");
       gzip.ungzip(gzipedData).then( (decompressed) => {
       //   response.end(decompressed.toString()); 
       var dataObject= JSON.parse(decompressed.toString());
       functions.run({
              "name": "m_user_login",
              "data":{"objectId":dataObject.aa,
              "vaid":dataObject.bb,
              "imei0":dataObject.cc,
              "imei1":dataObject.dd,
              "imei":dataObject.ee,
              "utdid":dataObject.ff,
              "versionCode":dataObject.gg,
              "phoneModel":dataObject.hh,
              "version":dataObject.ii,
              }
            },function(err,data){
                  var dataResult= JSON.parse(data);
                  response.send(Buffer.from(JSON.stringify(dataResult),'utf-8').toString('base64'));
            });
                    
       
       });
   }

}