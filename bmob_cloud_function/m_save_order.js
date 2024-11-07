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
  var httpType = request.method;
  var imei;
  var version;
  var utdid;
  var tradeNo;
  var outTradeNo;
  var goodsName;
  var payType;
  var amount;
  var responseVal;
  var checkFailed;  
  var checkResult;

   if ("GET" == httpType) {
       imei = request.query.imei;
       version = request.query.version;
       utdid = request.query.utdid;
       objectId = request.query.objectId;
       tradeNo =  request.query.tradeNo;
       outTradeNo = request.query.outTradeNo;
       goodsName = request.query.goodsName;
       payType = request.query.payType;
       amount = request.query.amount;
       responseVal = request.query.responseVal;
       checkFailed = request.query.checkFailed;
       checkResult = request.query.checkResult;

   }else {
       imei = request.body.imei;
       version = request.body.version;
       utdid = request.body.utdid;
       objectId = request.body.objectId;
       tradeNo =  request.body.tradeNo;
       outTradeNo = request.body.outTradeNo;
       goodsName = request.body.goodsName;
       payType = request.body.payType;
       amount = request.body.amount;
       responseVal = request.body.responseVal;
       checkFailed = request.body.checkFailed;
       checkResult = request.body.checkResult;
   }

   if (imei === undefined) imei = "";
   if (version === undefined) version = "";
   if (utdid === undefined) utdid = "";
   if (tradeNo === undefined) tradeNo = "";
   if (outTradeNo === undefined) outTradeNo = "";
   if (goodsName === undefined) goodsName = ""; 
   if (payType === undefined) member_type = "";
   if (amount === undefined) amount = 0 ;
   if (responseVal === undefined) responseVal = "";
   if (checkFailed === undefined) checkFailed = false;
   if (checkResult === undefined) checkResult = false;
    
    var _result = {
      "code":"", //错误码,A001,A002,A003,A003,A004,A005,A1024
      "info":"",
  };
  
//   tradeNo,checkFailed,objectId,amount,checkResult,goodsName,payType,responseVal,updatedAt,createdAt,utdid,outTradeNo,version

db.insert({
    "table":"OrderInfo",
    "data":{"utdid":utdid,"tradeNo":tradeNo,"imei":imei,"checkResult":Number(checkResult),"checkFailed":Number(checkFailed),"version":version,
    "goodsName":goodsName,"payType":payType,"amount":Number(amount),"responseVal":responseVal,"outTradeNo":outTradeNo}
  },function(err,data){
      var dataObject= JSON.parse(data);
      if (dataObject.code !== undefined){ //插入数据错误
          _result.code = "A005";
          _result.info = dataObject.error;
          response.send(_result);
      }else { 
         _result.code = "A1024";
          _result.info = dataObject.error;
          response.send(_result);
      }
  });

}