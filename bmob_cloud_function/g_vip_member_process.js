/*Google用户购买会员后的处理
 */ 
function onRequest(request, response, modules) {
    // private String orderId;//订单号,"GPA.3346-9427-6870-84300
    // private String packageName;//包名,make.more.r2d2.google.cellular_pro
    // private String productId; //会员属性，普通会员：general，高级会员：senior
    // private long purchaseTime;//1575940727676,1970-1-1
    // private int purchaseState;
    // private String purchaseToken; //dhcljndbbabjmfihklobamnl.AO-J1OyNO84mXCGO6-QkLx6ip661mRFHj15V_S-1FNYDbVd
    // private String utdid;//用户的序列号
    // private String imei;
    // private String purchaseTimeDesc;
    // private String version;
    // private String phoneModel;
    // private String country;
    // private String zzc;
    
    var db = modules.oData;
    var functions = modules.oFunctions;
    var Bql = modules.oBql;
    var httpType = request.method;
    var orderId;
    var packageName;
    var productId;
    var purchaseTime;
    var purchaseTimeDesc;
    var purchaseState;
    var purchaseToken;
    var utdid;
    var imei;
    var version;
    var phoneModel;
    var country;
    var zzc;
    var serviceCodeUpdate;
    
   if ("GET" == httpType) {
       orderId = request.query.orderId;
       packageName = request.query.packageName;
       productId = request.query.productId;
       purchaseTime = request.query.purchaseTime;
       purchaseTimeDesc = request.query.purchaseTimeDesc;
       purchaseState = request.query.purchaseState;
       purchaseToken = request.query.purchaseToken;
       utdid = request.query.utdid;
       imei = request.query.imei;
       version = request.query.version;
       phoneModel = request.query.phoneModel;
       country = request.query.country;
       zzc = request.query.zzc;
       serviceCodeUpdate = request.query.serviceCodeUpdate;
    
   }else {
       orderId = request.body.orderId;
       packageName = request.body.packageName;
       productId = request.body.productId;
       purchaseTime = request.body.purchaseTime;
       purchaseTimeDesc = request.body.purchaseTimeDesc;
       purchaseState = request.body.purchaseState;
       purchaseToken = request.body.purchaseToken;
       utdid = request.body.utdid;
       imei = request.body.imei;
       version = request.body.version;
       phoneModel = request.body.phoneModel;
       country = request.body.country;
       zzc = request.body.zzc;
       serviceCodeUpdate = request.body.serviceCodeUpdate;
   }
   if (purchaseTime === undefined || purchaseTime === null) purchaseTime = 0;
   if (purchaseState === undefined || purchaseState === null) purchaseState = 0;
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
  db.find({
    "table":"GoogleVipInfo",
    "where":{"orderId":orderId},
    "order":"-updatedAt",
    "limit":1
  },function(err,data){
       var resultObject= JSON.parse(data);
       for(var results in resultObject)
          {
            var resultArr = resultObject[results];
            if (JSON.stringify(resultArr) == '[]') {
                //   _result.code = "A002";
                //   _result.info =  "could not found record";
                //   response.send(_result);
                  functions.run({
                      "name": "g_save_user",
                      "data":{"orderId":orderId,"utdid":utdid,"productId":productId,"imei":imei,
                      "version":version,"zzc":zzc,"serviceCodeUpdate":serviceCodeUpdate,"packageName":packageName,"purchaseToken":purchaseToken,
                      "purchaseTime":Number(purchaseTime),"purchaseTimeDesc":purchaseTimeDesc,"phoneModel":phoneModel,"country":country,
                      "purchaseState":Number(purchaseState),"checkResult":2048,"banned":false,}
                    },function(err,data){
                      //回调函数
                      if (data.error === undefined) {
                          response.send(data);
                      }else {
                           _result.code = "A006";
                          _result.info =  data.error;
                          response.send(_result);
                      }
                     
                    });
            }else {
                //only one
                var dataObject = resultArr[0];
                if (dataObject === undefined) {
                     _result.code="A002"; //找不到记录
                     _result.info= "not found user information";
                    response.send(_result);
                }
                if (dataObject.banned || dataObject.checkResult == '002') {
                   _result.code = "A005";
                   _result.info = "banned"
                   response.send(_result);  
                }
                 if (dataObject.utdid !== utdid) { //id has been changed
                    var moment = modules.oMoment;
                    var serviceUpdateTime = moment(dataObject.serviceCodeUpdate, "YYYY-MM-DD HH:mm:ss");
                    var createdAt = moment(dataObject.createdAt);//.format('YYYY-MM-DD HH:mm:ss')
                    var nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    if ( moment().diff(moment(serviceUpdateTime), 'days') > 7  || dataObject.serviceCodeUpdate === null) { //more than 7 days
                        //update
                        db.update({
                            "table":"GoogleVipInfo",
                            "objectId":dataObject.objectId,
                            "data":{"utdid":utdid,"imei":imei,"version":version,"serviceCodeUpdate":nowTime}
                          },function(err,data){
                              if (data.error === undefined) { // // {"updatedAt":"2023-03-05 15:14:58"}
                                _result.code = "A1024";
                                _result.info = "utdid has been updated. serviceCodeUpdate time has been updated"
                                _result.updatedAt = data.updatedAt;
                                 response.send(_result);         
                              }else {
                                _result.code = "A001";
                                _result.updatedAt = data.updatedAt;
                                 response.send(_result);         
                              }
                             
                          });
                    }else { // < 7 days
                         _result.code = "A003"; //device exist error,please warn user
                         _result.info = "utdid has changed, but serviceCodeUpdate changed in 7 days."
                         _result.updatedAt = dataObject.updatedAt;
                          response.send(_result);            
                    }
    
                }else { // no change
                     _result.code = "A1024";
                     _result.updatedAt = dataObject.serviceCodeUpdate;
                     response.send(_result);    
                }
            }
            break;
          }
      
  });
}                                                                                    