/*
 分析白名单，黑名单的分析，增加dev，imei的校验，更完善，避免作弊
 */ 
function onRequest(request, response, modules) {
    var db = modules.oData;
    var Bql = modules.oBql;
    var httpType = request.method;
    var aa;
    var bb;
    var utdid;
    var imei;
    var dev_md5;
    var imei_md5;
   if ("GET" == httpType) {
       bb = request.query.bb;
       aa = request.query.aa;
       dev_md5 = request.query.cc; //md5
       imei_md5 = request.query.dd; //md5
   }else {
       bb = request.body.bb;
       aa =  request.body.aa;
       bb =  Buffer.from(bb, 'base64').toString('utf-8');
       aa =  Buffer.from(aa, 'base64').toString('utf-8');
       dev_md5 = request.body.cc; //md5
       imei_md5 = request.body.dd; //md5

  }
  utdid = bb;
  imei =  aa;
  
  if( dev_md5 === undefined || dev_md5 === null || dev_md5.length === 0)
    dev_md5= "unknown"
 if( imei_md5 === undefined || imei_md5 === null || imei_md5.length === 0)
    imei_md5= "unknown"
    
 if( imei === undefined || imei === null)
    imei= "undefined12345678"
 if( utdid === undefined || utdid === null)
    utdid= "undefined12345678"
        
        //   code = obj.optString("aa",""); //code
        //     objectId = obj.optString("bb",""); //objectId
        //     createdAt = obj.optString("cc",""); //createdAt
        //     updatedAt = obj.optString("dd",""); //
        //     expireDate = obj.optString("ee","");
        //     utdid = obj.optString("ff","");
        //     uuid = obj.optString("gg","");
        //     order = obj.optString("hh","");
        //     member_type = obj.optString("ii","");
        //     info = obj.optString("jj","");
            
  var _result = {
      "code":"", //错误码,A001,A002,A003,A003,A004,A005,A1024
      "jj":"", //info
      "ii":"", //member_type
      "cc":"", //创建日期
      "dd":"",  //更新日期
      "ee":"", //过期日期
      "bb":"",  //对象属性 objectId
      "ff":"", //utdid
      "gg":"" //uuid
  };
   //var imei = "862258033704520#862258033704538";
   var likes = "%"+imei+"%";
   var sql =  "select * from GoogleBlackList where utdid=?"  + " or IMEI like " + likes + " order by updatedAt desc limit 1";
   var sql2 = "select * from GoogleWhiteList where utdid=?"  + " or IMEI like " + likes + " order by updatedAt desc limit 1";
   //response.end("sql="+sql);
   Bql.exec({
      "bql":sql,
       "values":"[\""+utdid+"\"]"
    },function(err,data){
        var resultObject = JSON.parse(data);
        for(var results in resultObject)
          {
            var resultArr = resultObject[results];
            if (JSON.stringify(resultArr) == '[]') {
                  //response.end("is null");
                  Bql.exec({
                      "bql":sql2,
                       "values":"[\""+utdid+"\"]"
                    },function(err,data){
                        var moment = modules.oMoment
                        var time = moment().format('YYYY-MM-DD HH:mm:ss');
                        var resultObject = JSON.parse(data);
                        for (var results in resultObject) {
                            var resultArr = resultObject[results];
                             if (JSON.stringify(resultArr) == '[]') {
                                 _result.code = "A100"
                                 response.send(_result); //不再白名单也不再黑名单
                             }else { //exist white list
                                  for(var oneline in resultArr){
                                      var expireTime = resultArr[oneline].expireDate.iso;
                                      if (expireTime < time) {
                                         // response.end ("< current date")
                                         _result.code="A101"
                                          response.send(_result); //白名单，已经过期了
                                      }else {
                                           var db_dev_md5 = resultArr[oneline].dev_md5;
                                           var db_imei_md5 = resultArr[oneline].imei_md5;
                                           if (db_dev_md5 === '' || db_dev_md5 === undefined) db_dev_md5 = 'unknown'
                                           if (db_imei_md5 === '' || db_imei_md5 === undefined) db_imei_md5 = 'unknown'
                                           
                                        //   response.send("dev_md5 = " +dev_md5 + ",db_dev_md5 = " + db_dev_md5 + ",imei_md5 = " + imei_md5 
                                        //         + ",db_imei_md5 =" + db_imei_md5);   
                                           if ( (  db_dev_md5 === 'unknown' && dev_md5 !== 'unknown') 
                                               || (db_imei_md5 === 'unknown' && imei_md5 !== 'unknown')) {
                                                          
                                                db.update({
                                                    "table":"GoogleWhiteList",
                                                    "objectId":resultArr[oneline].objectId,
                                                    "data":{"dev_md5":dev_md5,"imei_md5":imei_md5}
                                                  },function(err,data){
                                                      if (data.error === undefined) { // // {"updatedAt":"2023-03-05 15:14:58"}
                                                             _result.code="A102";
                                                              _result.ii = resultArr[oneline].member_type;
                                                              _result.ee =  resultArr[oneline].expireDate.iso;
                                                              _result.bb = resultArr[oneline].objectId;
                                                              _result.cc = resultArr[oneline].createdAt.iso;
                                                              response.send(_result); //白名单，有效中
                                           
                                                      }else {
                                                        _result.code = "A103"; //操作数据库失败
                                                        _result.updatedAt = data.updatedAt;
                                                         response.send(_result);         
                                                      }
                                                     
                                                  });
                                           }else {
                                                                                              
                                                // response.send("dev_md5 = " +dev_md5 + ",db_dev_md5 = " + db_dev_md5 + ",imei_md5 = " + imei_md5 
                                                // + ",db_imei_md5 =" + db_imei_md5);     
                                                   //设备校验
                                                    if (( dev_md5 !== db_dev_md5 && db_dev_md5 != 'unknown') 
                                                      || (imei_md5 !==  db_imei_md5 && db_imei_md5 != 'unknown' && imei_md5 != 'unknown' )) {
                                                         _result.code="A104";//附加校验失败
                                                         response.send(_result); //设备或者imei校验不通过
                                                    }
                                                  _result.code="A102";
                                                  _result.ii = resultArr[oneline].member_type;
                                                  _result.ee =  resultArr[oneline].expireDate.iso;
                                                  _result.bb = resultArr[oneline].objectId;
                                                  _result.cc = resultArr[oneline].createdAt.iso;
                                                  response.send(_result); //白名单，有效中
                                           }
                                   
                                      }
                                      break;
                                    }
                                 
                             }
                          break;
                        }
                    });
                    
            }else {
                  _result.code = "A103"
                  response.send(_result); //黑名单
            }
            break;
          }
    
    });
    
}