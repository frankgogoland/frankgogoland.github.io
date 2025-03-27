/*
主版本创建一个新会员 代替 代替g_save_user
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
    
    
*/
function onRequest(request, response, modules) {
    var db = modules.oData;
    var Bql = modules.oBql;
    var httpType = request.method;
    var orderId;
    var packageName;
    var productId;
    var purchaseTime;
    var purchaseTimeDesc;
    var purchaseState;
    var purchaseToken;
    var serviceCodeUpdate;
    var utdid;
    var imei;
    var version;
    var phoneModel;
    var country;
    var zzc;
    var checkResult;

   if ("GET" == httpType) {
       orderId = request.query.aa;
       packageName = request.query.ee;
       productId = request.query.ff;
       purchaseTime = request.query.ll;
       purchaseTimeDesc = request.query.nn;
       purchaseState = request.query.mm;
       purchaseToken = request.query.purchaseToken;
       utdid = request.query.cc;
       imei = request.query.bb;
       version = request.query.kk;
       phoneModel = request.query.dd;
       country = request.query.jj;
       zzc = request.query.gg;
       serviceCodeUpdate = request.query.hh;
       checkResult = request.query.ii;
    
   }else {
       orderId = request.body.aa;
       packageName = request.body.ee;
       productId = request.body.ff;
       purchaseTime = request.body.ll;
       purchaseTimeDesc = request.body.nn;
       purchaseState = request.body.mm;
       purchaseToken = request.body.purchaseToken;
       utdid = request.body.cc;
       imei = request.body.bb;
       version = request.body.kk;
       phoneModel = request.body.dd;
       country = request.body.jj;
       zzc = request.body.gg;
       serviceCodeUpdate = request.body.hh;
       checkResult = request.body.ii;
       packageName =  Buffer.from(packageName, 'base64').toString('utf-8');
       checkResult =  Buffer.from(checkResult, 'base64').toString('utf-8');
       utdid = Buffer.from(utdid, 'base64').toString('utf-8');
       productId =  Buffer.from(productId, 'base64').toString('utf-8');
       country =  Buffer.from(country, 'base64').toString('utf-8');
       zzc =  Buffer.from(zzc, 'base64').toString('utf-8');
       orderId =  Buffer.from(orderId, 'base64').toString('utf-8');
       phoneModel =  Buffer.from(phoneModel, 'base64').toString('utf-8');
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
   if (imei === undefined) imei = null;
   if (version === undefined) version = null;
   if (phoneModel === undefined) phoneModel = null;
   if (utdid === undefined) utdid = null;
   if (checkResult === undefined || checkResult === "" || checkResult === null) {
        _result.code = "A005";
        _result.info = "invalid param";
        response.send(_result);
       return;
   }

  var moment = modules.oMoment;
  var createdAt = moment();//.format('YYYY-MM-DD HH:mm:ss')
//  var expireDate =  createdAt.add(day, 'days').add(month, 'months').format('YYYY-MM-DD HH:mm:ss');
  db.insert({
    "table":"GoogleVipInfo",
    "data":{"utdid":utdid,"orderId":orderId,"packageName":packageName,"productId":productId,"imei":imei,"version":version,
    "purchaseTime":Number(purchaseTime),"purchaseTimeDesc":purchaseTimeDesc,"serviceCodeUpdate":serviceCodeUpdate,"country":country,
    "phoneModel":phoneModel,"zzc":zzc,"checkResult":checkResult,"purchaseState":Number(purchaseState)}
  },function(err,data){
      var dataObject= JSON.parse(data);
      if (dataObject.code !== undefined){ //插入数据错误
          _result.code = "A005";
          _result.info = dataObject.error;
          response.send(_result);
      }else { //{"createdAt":"2023-02-23 15:16:27","objectId":"a3256a1aa5"}
         // var moment = modules.oMoment;
         // var createdAt = moment(dataObject.createdAt);//.format('YYYY-MM-DD HH:mm:ss')
          _result.code = "A1024";
          _result.objectId = dataObject.objectId;
          _result.createdAt = dataObject.createdAt;
          _result.member_type = productId;
          _result.utdid = utdid;
          _result.updatedAt = dataObject.updatedAt;
          response.send(_result);
      }
  });
 
                                                                              
}