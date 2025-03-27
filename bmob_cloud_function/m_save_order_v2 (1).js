/*
保存订单信息
返回结果
{
    "code": "A1024",
    "info": "",
}
*/
function onRequest(request, response, modules) {
  var db = modules.oData;
  var gzip = modules.oGzip;
  var httpType = request.method;
  var functions = modules.oFunctions;

   if ("GET" == httpType) {
      _result.code = "A005";
      _result.objectId = objectId;
      _result.info = "user has been blocked";
      response.send(_result);
   }else {
       body = request.body.data;
       var gzipedData = Buffer.from(body, "base64");
       gzip.ungzip(gzipedData).then( (decompressed) => {
       //   response.end(decompressed.toString()); 
       var dataObject= JSON.parse(decompressed.toString());
       functions.run({
              "name": "m_save_order",
              "data":{"tradeNo":dataObject.aa,
              "outTradeNo":dataObject.bb,
              "goodsName":dataObject.cc,
              "imei":dataObject.ee,
              "payType":dataObject.dd,
              "utdid":dataObject.ff,
              "amount":dataObject.gg,
              "responseVal":dataObject.hh,
              "checkResult":dataObject.ii,
              "checkFailed":dataObject.jj,
              "version":dataObject.kk
              }
            },function(err,data){
                  var dataObject= JSON.parse(data);
                  response.send(dataObject);
            });
                    
       
       });
   }


}