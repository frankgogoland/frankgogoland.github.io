/*
 checkTry
 */ 
function onRequest(request, response, modules) {

   var db = modules.oData;
    var Bql = modules.oBql;
    var httpType = request.method;
    var utdid;
    var imei;
    var imei0;
    var imei1;
    var objectId;
    var version;
    var vaid;
    var uuid;
    var likeImei0;
    var likeImei1;
   if ("GET" == httpType) {
       utdid = request.query.utdid;
       vaid = request.query.vaid;
       imei0 = request.query.imei0;
       imei1 = request.query.imei1;
     //  uuid = request.query.uuid;
   }else {
       utdid = request.body.utdid;
       vaid = request.body.vaid;
       imei0 = request.body.imei0;
       imei1 = request.body.imei1;
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
  if (imei0 !== undefined && imei0.length >= 15) {
      likeImei0 = "%"+imei0+"%";
  }
  if (imei1 !== undefined && imei1.length >= 15) {
      likeImei1 = "%"+imei1+"%";
  }
   
  var sql = "select * from VipInfo where ";
  var vaid_sql;
  var likeImei0_sql;
  var likeImei1_sql;
  var utdid_sql;
  var count = 0;
  if (vaid !== undefined && vaid.length > 10) {
    vaid_sql = " vaid = " + "\'"  + vaid + "\'";
    count ++;
  }
  if (utdid !== undefined && utdid.length > 10) {
     utdid_sql = " utdid=" + "\'" + utdid+ "\'" ;
     count++; 
  }
  if (likeImei0 !== undefined && likeImei0.length > 10) {
     likeImei0_sql =  " imei like "  + likeImei0;  
     count++;
  }    
  if (likeImei1 !== undefined && likeImei1.length > 10) {
     likeImei1_sql  = " imei like "  + likeImei1;
     count++;
  }

  if (utdid_sql !== undefined) {
     sql += utdid_sql;
     if (vaid_sql !== undefined)      sql += " or " + vaid_sql;
     if (likeImei0_sql !== undefined) sql += " or " + likeImei0_sql;
     if (likeImei1_sql !== undefined) sql += " or " + likeImei1_sql;
  }else {
         _result.code = "A001";
        _result.info =  "invalid parameters";
        response.send(_result); 
  }

 //response.end(sql);
   

 Bql.exec({
      "bql":sql
     
 },function(err,data){
        var resultObject = JSON.parse(data);
        for(var results in resultObject)
          {
            var resultArr = resultObject[results];
            if (JSON.stringify(resultArr) == '[]') {
                   //_result.code = "A002";
                   _result.code = "A1024"; //不让试用了
                   _result.info =  "could not found record";
                   response.send(_result);
            }else {
                //only one
                _result.code="A1024"; //找到记录,不能试用
                 _result.info= "found user information";
                response.send(_result);

            }
            break;
          }
    });

}