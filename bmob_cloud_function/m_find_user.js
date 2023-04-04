/*
 会员vip图标点4下查找用户，并激活会员
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
   //   objectId = request.query.objectId;
      vaid = request.query.vaid;
      imei0 = request.query.imei0;
      imei1 = request.query.imei1;
      version= request.query.version;
    //  uuid = request.query.uuid;
  }else {
      utdid = request.body.utdid;
      vaid = request.body.vaid;
      imei0 = request.body.imei0;
      imei1 = request.body.imei1;
     // uuid = request.body.uuid;
      version = request.body.version;
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
 // response.end("likeimei0=" + likeImei0);
  
 var sql = "select * from VipInfo where uuid = '1024'";
 var vaid_sql;
 var likeImei0_sql;
 var likeImei1_sql;
 var utdid_sql;
 var count = 0;
 if (vaid !== undefined && vaid.length > 10) {
   vaid_sql = " vaid = " + "\'"  + vaid + "\'";
   count ++;
 }
 if (utdid !== undefined) {
    utdid_sql = " utdid=" + "\'" + utdid+ "\'" ;
    count++; 
 }
 if (likeImei0 !== undefined) {
    likeImei0_sql =  " imei0 like "  + likeImei0;  
    count++;
 }    
 if (likeImei1 !== undefined) {
    likeImei1_sql  = " imei1 like "  + likeImei1;
    count++;
 }
 if (count  > 1) {
     sql += " and ( ";
     
 
   if (utdid_sql !== undefined) {
        if (vaid_sql !== undefined) { //check vaid
           sql += vaid_sql;
           sql += " or " + utdid_sql;
        }else {
             sql += utdid_sql;
        }
   }
   if (likeImei0_sql !== undefined) sql += " or " + likeImei0_sql;
   if (likeImei1_sql !== undefined) sql += " or " + likeImei1_sql;
     sql += ") ";
}else if (count == 1) {
     sql += " and ";
   if (vaid_sql !== undefined) sql += vaid_sql;
   else if (utdid_sql !== undefined) sql += utdid_sql;
   else if (likeImei0_sql !== undefined) sql += likeImei0_sql;
   else if (likeImei1_sql !== undefined) sql += likeImei1_sql;
}
else if (count === 0) {
    response.send("not match anything");
}
 sql += " order by updatedAt desc limit 1";
 
// response.end(sql);
  
//   "select * from VipInfo where uuid = '1024' and (utdid = 'ABD326966F1EB4BF' or IMEI like '%3433434343%') order by updatedAt desc limit 1"
  //response.end(sql);
  //var sql =  "select * from VipInfo where utdid=?"  + " or IMEI like " + likes;
  //var sql2 = "select * from GoogleWhiteList where utdid=?"  + " or IMEI like " + likes + " order by updatedAt desc limit 1";
  
Bql.exec({
     "bql":sql
    
},function(err,data){
       var resultObject = JSON.parse(data);
       for(var results in resultObject)
         {
           var resultArr = resultObject[results];
           if (JSON.stringify(resultArr) == '[]') {
                  _result.code = "A002";
                  _result.info =  "could not found record";
                  response.send(_result);
           }else {
               //only one
               var dataObject = resultArr[0];
               if (dataObject === undefined) {
                    _result.code="A002"; //找不到记录
                    _result.info= "not found user information";
                   response.send(_result);
               }
               //response.end(dataObject);
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
                       uuid = data;
                       if (utdid === undefined) utdid = dataObject.utdid;
                       if (vaid === undefined) vaid = dataObject.vaid;
                       if (imei0 === undefined) imei0 = dataObject.imei0;
                       if (imei1 === undefined) imei1 = dataObject.imei1;
                       if (imei === undefined)  imei = dataObject.imei; 
                       if (version === undefined)  version = dataObject.version; 
                       functions.run({
                         "name": "m_update_user",
                         "data":{"objectId":objectId,"utdid":utdid,"uuid":uuid,"imei0":imei0,"imei1":imei1,"imei":imei,"version":version,"vaid":vaid}
                       },function(err,data){
                         //回调函数
                         if (data.error === undefined) {
                             _result.code = "A1024";
                             _result.utdid = utdid;
                             _result.updatedAt = dataObject.updatedAt;
                             _result.createdAt = dataObject.createdAt;
                             _result.objectId = objectId;
                             _result.member_type = dataObject.member_type;
                             _result.expireDate = expireDate.format('YYYY-MM-DD HH:mm:ss');
                             _result.uuid = uuid;
                             _result.utdid = utdid;
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
   });

//  List<BmobQuery<VipInfo>> queries = new ArrayList<BmobQuery<VipInfo>>();
//         if(isValidImei()) {
//             BmobQuery<VipInfo> eq1 = new BmobQuery<VipInfo>();
//             eq1.addWhereContainedIn("imei", Arrays.asList(new String[]{getImeiStr(), getImeiReverse()}));
//             queries.add(eq1);
//         }
//         if (isValidVaid()) {
//             BmobQuery<VipInfo> eq2 = new BmobQuery<VipInfo>();
//             eq2.addWhereEqualTo("vaid", vaid);
//             queries.add(eq2);
//         }

//         BmobQuery<VipInfo> eq3 = new BmobQuery<VipInfo>();
//         eq3.addWhereEqualTo("utdid", getServiceCode());
//         queries.add(eq3);
       
}                                                                                    