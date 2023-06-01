/*
checkVip的替换函数
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
    var chipset;
    var versionCode;
    var phoneModel;
   if ("GET" == httpType) {
       utdid = request.query.utdid;
       objectId = request.query.objectId;
       vaid = request.query.vaid;
       imei0 = request.query.imei0;
       imei1 = request.query.imei1;
       imei = request.query.imei;
       version= request.query.version;
       chipset = request.query.chipset;
       versionCode = request.query.versionCode;
       phoneModel = request.query.phoneModel;
   }else {
       utdid = request.body.utdid;
       objectId = request.body.objectId;
       vaid = request.body.vaid;
       imei0 = request.body.imei0;
       imei1 = request.body.imei1;
       imei = request.body.imei;
       version = request.body.version;
       chipset =request.body.chipset;
       versionCode = request.body.versionCode;
       phoneModel = request.body.phoneModel;
   }
  if (chipset === undefined) chipset = 1;   //qualcomm 
  var _result = {
      "code":"", //错误码,A001,A002,A003,A003,A004,A005,A1024
      "info":"",
      "member_type":"",
      "createdAt":"", //创建日期
      "updatedAt":"",  //更新日期
      "expireDate":"", //过期日期
      "objectId":"",   //对象属性
      "utdid":"",
      "uuid":"",
      "nrForce":false
  };
  
  //objectId 不存在，此时需要根据utdid,vaid等信息进行匹配(不包括IMEI)
  if(objectId === undefined || objectId.length === 0) {
    //   if (imei0 !== undefined && imei0.length >= 15) {
    //       likeImei0 = "%"+imei0+"%";
    //   }
    //   if (imei1 !== undefined && imei1.length >= 15) {
    //       likeImei1 = "%"+imei1+"%";
    //   }
      // response.end("likeimei0=" + likeImei0);
       
      var sql = "select * from VipInfo where ";
      var vaid_sql;
      var likeImei0_sql;
      var likeImei1_sql;
      var utdid_sql;
      var count = 0;
      if (vaid !== undefined && vaid.length > 0 ) {
        vaid_sql = " vaid = " +  "\'" +  vaid + "\'";
        count ++;
      }
      if (utdid !== undefined && utdid.length > 0 ) {
         utdid_sql = " utdid = " + "\'" + utdid+ "\'" ;
         count++; 
      }
    //   if (likeImei0 !== undefined) {
    //      likeImei0_sql =  " imei0 like "  + likeImei0;  
    //      count++;
    //   }    
    //   if (likeImei1 !== undefined) {
    //      likeImei1_sql  = " imei1 like "  + likeImei1;
    //      count++;
    //   }
      if (count  > 1) {
        
        if (vaid_sql !== undefined) sql += vaid_sql;
        sql += "   or  ";
        if (utdid_sql !== undefined) sql += utdid_sql;
     //   if (likeImei0_sql !== undefined) sql += " or " + likeImei0_sql;
      //  if (likeImei1_sql !== undefined) sql += " or " + likeImei1_sql;
      
     }else if (count == 1) {
        if (vaid_sql !== undefined) sql += vaid_sql;
        else if (utdid_sql !== undefined) sql += utdid_sql;
      //  else if (likeImei0_sql !== undefined) sql += likeImei0_sql;
      //  else if (likeImei1_sql !== undefined) sql += likeImei1_sql;
     }
     else if (count === 0) { //这个情况最好在客户端进行屏蔽掉！
         _result.code="A001"; //没有IMEI,没有VAID，不提供免费试用。
         _result.info= "invalid input parameters"
         response.send(_result);
         return;
     }
     sql += " order by updatedAt desc limit 1";
  
  //  response.end(sql);
  //  sql = "select * from VipInfo  where  vaid = 'fb20e5aa21ce4d8f' order by updatedAt desc limit 1";
  //   "select * from VipInfo where uuid = '1024' and (utdid = 'ABD326966F1EB4BF' or IMEI like '%3433434343%') order by updatedAt desc limit 1"
     Bql.exec({
          "bql":sql
     },function(err,data){
           var resultObject = JSON.parse(data);
         //  response.end(resultObject + ",err = " + err);
          for(var results in resultObject)
          {
            var resultArr = resultObject[results];
           // response.send(resultArr);
             
            if (JSON.stringify(resultArr) === '[]') {
                _result.code="A002"; //找不到记录
                _result.info= "not found user information";
                response.send(_result);
                
            }else {
                var dataObject = resultArr[0];
                if (dataObject === null) {
                     _result.code="A002"; //找不到记录
                     _result.info= "not found user information";
                    response.send(_result);
                }
                if (dataObject.uuid == "002") {
                   _result.code = "A005";
                   _result.objectId = dataObject.objectId;
                   _result.info = "user has been blocked";
                   response.send(_result);
               } 
                //response.send(dataObject);
                var day = dataObject.day;
                var month = dataObject.month;
                var moment = modules.oMoment;
                var createdAt = moment(dataObject.createdAt);//.format('YYYY-MM-DD HH:mm:ss')
                var expireDate = createdAt.add(day, 'days').add(month, 'months');   
                var objectId = dataObject.objectId;
                if (expireDate > moment() ) { //在有效期内
                   var functions = modules.oFunctions;
                   functions.run({
                      "name": "generateUUID",
                      "data":null
                    },function(err,data){
                        var uuid = data;
                        if (utdid === undefined) utdid = "";
                        if (vaid === undefined) vaid = "";
                        if (imei0 === undefined) imei0 = "";
                        if (imei1 === undefined) imei1 = "";
                        if (imei === undefined)  imei = ""; 
                        functions.run({
                           "name": "m_update_user",
                            "data":{"objectId":objectId,"utdid":utdid,"uuid":uuid,"imei0":imei0,"imei1":imei1,"imei":imei,"version":version,"vaid":vaid,"chipset":chipset}
                        },function(err,data){
                            var _dataObject= JSON.parse(data);
                            if (_dataObject.error === undefined) {
                              _result.code = "A1024";
                              _result.objectId = objectId;
                              _result.createdAt = dataObject.createdAt;
                              _result.member_type = dataObject.member_type;
                              _result.updatedAt = _dataObject.updatedAt;
                              _result.expireDate = expireDate.format('YYYY-MM-DD');
                              _result.utdid = utdid;
                              _result.uuid = uuid;
                              _result.nrForce = dataObject.nrForce;
                              response.send(_result);
                            }else {
                                _result.code = "A003";
                                _result.info =  data.error;
                                response.send(_result);
                            }
                        }); 
                    });
                }else { //expired
                      _result.code = "A004";
                      _result.objectId = objectId;
                      _result.info = "user has expired";
                      _result.expireDate = expireDate.format('YYYY-MM-DD HH:mm:ss');
                      response.send(_result);
                    }

                }
                break;
             }
      }

  );
  return;
}

//objectId exist, enter this codes
  db.findOne({
    "table":"VipInfo",
    "objectId":objectId
   },function(err,data){
      var dataObject= JSON.parse(data);
     // response.end("err = " + dataObject.error + ",data = " + data);
      if(dataObject.error === undefined){
            if (dataObject.uuid == "002") {
                _result.code = "A005";
                _result.objectId = objectId;
                _result.info = "user has been blocked";
                response.send(_result);
            } 
            if (vaid === undefined) vaid = "";
            if (imei0 === undefined) imei0 = "";
            if (imei1 === undefined) imei1 = "";
            if (imei === undefined) imei = ""; 
            //utdid 相对，vaid匹配，imei匹配，符合其中之一就认为成功
            if (dataObject.utdid == utdid ||
                (dataObject.vaid !== null &&  dataObject.vaid.length > 0 && dataObject.vaid == vaid) ||  
                (dataObject.imei0 !== null &&  dataObject.imei0.length > 0  && dataObject.imei0 == imei0) ||
                (dataObject.imei1 !== null &&  dataObject.imei1.length > 0  && dataObject.imei1 == imei1)) {
                    var day = dataObject.day;
                    var month = dataObject.month;
                    var moment = modules.oMoment;
                    var createdAt = moment(dataObject.createdAt);//.format('YYYY-MM-DD HH:mm:ss')
                    var expireDate = createdAt.add(day, 'days').add(month, 'months');   
                    if (expireDate > moment() ) { //在有效期内
                        var functions = modules.oFunctions;
                               functions.run({
                                  "name": "generateUUID",
                                  "data":null
                                },function(err,data){
                                    var uuid = data;
                                    functions.run({
                                       "name": "m_update_user",
                                        "data":{"objectId":objectId,"utdid":utdid,"uuid":uuid,"imei0":imei0,"imei1":imei1,"imei":imei,"version":version,"vaid":vaid,"chipset":chipset}
                                    },function(err,data){
                                        var _dataObject= JSON.parse(data);
                                        if (_dataObject.error === undefined) {
                                          _result.code = "A1024";
                                          _result.objectId = objectId;
                                          _result.createdAt = dataObject.createdAt;
                                           _result.member_type = dataObject.member_type;
                                          _result.updatedAt = _dataObject.updatedAt;
                                          _result.expireDate = expireDate.format('YYYY-MM-DD');
                                          _result.uuid = dataObject.uuid;
                                          _result.utdid = dataObject.utdid;
                                          _result.nrForce = dataObject.nrForce;
                                          response.send(_result);
                                        }else {
                                              _result.code = "A003";
                                              _result.info =  data.error;
                                              response.send(_result);
                                        }
                                    }); 
                                });
                                
           
                    }else { //expired
                      _result.code = "A004";
                      _result.objectId = objectId;
                      _result.info = "user has expired";
                      _result.expireDate = expireDate.format('YYYY-MM-DD HH:mm:ss');
                      response.send(_result);
                    }
                
            }else {
                //check fail
                  _result.code = "A006";
                  _result.objectId = objectId;
                  _result.info = "invalid utdid or other params";
                  _result.utdid = utdid;
                   response.send(_result);
            }
           
          
      }else { //没有找到记录
           _result.code = "A002";
           _result.objectId = objectId;
          _result.info = dataObject.error;
          response.send(_result);
            
      }
     
     
     
  });
}         


function print(_result) {
    return   _result.code + "&&" +
             _result.info + "&&" + 
             _result.createdAt + "&&" + 
             _result.updatedAt + "&&" + 
             _result.expireDate + "&&" + 
             _result.objectId + "&&" + 
             _result.utdid + "&&" + 
             _result.uuid; 
}