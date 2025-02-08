/*Google用户购买会员后的处理,代替g_vip_member_process
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
  var orderId; //aa
  var packageName; //ee
  var productId; //ff
  var purchaseTime; //kk
  var purchaseTimeDesc; //mm
  var purchaseState; //ll
  var purchaseToken;
  var utdid; //cc
  var imei; //bb
  var version; //jj
  var phoneModel; //dd
  var country; //ii
  var zzc; //gg
  var serviceCodeUpdate; //hh
  
 if ("GET" == httpType) {
     orderId = request.query.aa;
     packageName = request.query.ee;
     productId = request.query.ff;
     purchaseTime = request.query.kk;
     purchaseTimeDesc = request.query.mm;
     purchaseState = request.query.ll;
     purchaseToken = request.query.purchaseToken;
     utdid = request.query.cc;
     imei = request.query.bb;
     version = request.query.jj;
     phoneModel = request.query.dd;
     country = request.query.ii;
     zzc = request.query.gg;
     serviceCodeUpdate = request.query.hh;
  
 }else {
     orderId = request.body.aa;
     packageName = request.body.ee;
     productId = request.body.ff;
     purchaseTime = request.body.kk;
     purchaseTimeDesc = request.body.mm;
     purchaseState = request.body.ll;
     purchaseToken = request.body.purchaseToken;
     utdid = request.body.cc;
     imei = request.body.bb;
     version = request.body.jj;
     phoneModel = request.body.dd;
     country = request.body.ii;
     zzc = request.body.gg;
     serviceCodeUpdate = request.body.hh;
     productId =  Buffer.from(productId, 'base64').toString('utf-8');
     packageName =   Buffer.from(packageName, 'base64').toString('utf-8');
     utdid =  Buffer.from(utdid, 'base64').toString('utf-8');
     country =  Buffer.from(country, 'base64').toString('utf-8');
     zzc =  Buffer.from(zzc, 'base64').toString('utf-8');
     orderId =  Buffer.from(orderId, 'base64').toString('utf-8');
     phoneModel =  Buffer.from(phoneModel, 'base64').toString('utf-8');
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
if (orderId === null || orderId === "" || !orderId.startsWith("GPA.33")) {
     _result.code = "A005";
     _result.info = "banned"
      response.send(_result);
      return;
}
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
               if (dataObject.utdid !== utdid  && dataObject.orderId != "GPA.3349-0261-9542-86181") { //id has been changed
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