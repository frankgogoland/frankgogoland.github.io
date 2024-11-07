function onRequest(request, response, modules) {
  var db = modules.oData;
  var functions = modules.oFunctions;
  var gzip = modules.oGzip;
  var _result = {
      "code":"" //错误码,A001,A002,A003,A003,A004,A005,A1024
  };
  functions.run({
                  "name": "m_get_config"
                },function(err,data){
                    var dataObject= JSON.parse(data);
                    if (dataObject.objectId !== null) {
                        _result.code = "A1024";
                        _result.aa = dataObject.showPay;
                        _result.bb = dataObject.lockAdSupport;
                        _result.cc = dataObject.minVersionCode;
                        _result.dd = dataObject.adPolicy;
                        _result.ee = dataObject.supportHisiNrLock;
                        _result.ff = dataObject.supportTrpay;
                        _result.gg = dataObject.accessKeyId;
                        _result.hh = dataObject.accessKeySecret;
                        _result.ii = dataObject.haisiPolicy;
                        _result.jj = dataObject.qualcommPolicy;
                        _result.kk = dataObject.showTry;
                        _result.ll = dataObject.price;
                        _result.mm = dataObject.mate60_policy;
                        _result.nn = dataObject.remark1;
                        _result.oo = dataObject.remark2;
                        _result.pp = dataObject.remark3;
                        _result.qq = dataObject.supportNewNrLockVer;
                        _result.rr = dataObject.hisiCollectScheme;
                        _result.ss = dataObject.lockAdPolicy;
                        _result.tt = dataObject.memCheckKeywords;
                        _result.uu = dataObject.signalAdPolicy;
                        _result.vv = dataObject.signalWatchTime;
                       //  response.send(_result);
                        gzip.gzip(JSON.stringify(_result)).then( (compressed) => {
                        response.send(Buffer.from(compressed,'utf-8').toString('base64'));
                      });
                    }else {
                        gzip.gzip(JSON.stringify(dataObject)).then( (compressed) => {
                        response.send(Buffer.from(compressed,'utf-8').toString('base64'));
                    });  
                    }
                    //response.send(JSON.stringify(dataObject));
                
                });
                
 
}