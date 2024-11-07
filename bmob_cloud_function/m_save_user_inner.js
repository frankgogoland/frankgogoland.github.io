/*
主版本创建一个新会员 代替 regBuy
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
*/
function onRequest(request, response, modules) {
  var db = modules.oData;
  var httpType = request.method;
  var imei;
  var imei0;
  var imei1;
  var vaid;
  var version;
  var uuid;
  var utdid;
  var objectId;
  var month;
  var day;
  var member_type;
  var order;
  var city;
  var phone;
  var phoneModel;
  var chipset;
  var member_property;
  
   if ("GET" == httpType) {
      // objectId = request.query.objectId;
       vaid = request.query.vaid;
       imei0 = request.query.imei0;
       imei1 = request.query.imei1;
       imei = request.query.imei;
       version = request.query.version;
       //uuid = request.query.uuid;
       utdid = request.query.utdid;
       month = request.query.month;
       day =  request.query.day;
       member_type = request.query.member_type;
       city = request.query.city;
       phone = request.query.phone;
       order = request.query.order;
       phoneModel = request.query.phoneModel;
       chipset = request.query.chipset;
       member_property = request.query.member_property;

   }else {
       //objectId = request.body.objectId;
       vaid = request.body.vaid;
       imei0 = request.body.imei0;
       imei1 = request.body.imei1;
       imei = request.body.imei;
       version = request.body.version;
       //uuid = request.body.uuid;
       utdid = request.body.utdid;
       month = request.body.month;
       day = request.body.day;
       member_type = request.body.member_type;
       city = request.body.city;
       phone = request.body.phone;
       order = request.body.order;
       phoneModel = request.body.phoneModel;
       chipset = request.body.chipset;
       member_property = request.body.member_property;
   }
  //  response.end("vaid = " + vaid);
   if (vaid === undefined) vaid = "";
   if (imei === undefined) imei = "";
   if (imei0 === undefined) imei0 = "";
   if (imei1 === undefined) imei1 = "";
   //if (uuid === undefined) uuid = null;
   if (version === undefined) version = "";
   if (month === undefined) month = 0;
   if (day === undefined) day = 0;
   if (day === 3) day = 1; //试用三天改成1天
   if (member_type === undefined) member_type = "g";
   if (city === undefined) city = "";
   if (phone === undefined) phone = "";
   if (utdid === undefined) utdid = "";
   if (chipset === undefined) chipset = 1;
   if (member_property === undefined) member_property = "";
    var _result = {
      "code":"", //错误码,A001,A002,A003,A003,A004,A005,A1024
      "info":"",
      "createdAt":"", //创建日期
      "updatedAt":"",  //更新日期
      "expireDate":"", //过期日期
      "objectId":"",   //对象属性
      "utdid":"",
      "uuid":""
  };
   
   //GET UUID
     var functions = modules.oFunctions;
       functions.run({
          "name": "generateUUID",
          "data":null
        },function(err,data){
         // uuid = data;     
         uuid = "1024";
          var moment = modules.oMoment;
          var createdAt = moment();//.format('YYYY-MM-DD HH:mm:ss')
          var expireDate =  createdAt.add(day, 'days').add(month, 'months').format('YYYY-MM-DD HH:mm:ss');
          if (order !== undefined) {
             var current_time = moment(moment()).format('YYYY-MM-DD_HH:mm:ss');//.format('YYYY-MM-DD HH:mm:ss')
             order += "&&" + current_time
         }
          db.insert({
            "table":"VipInfo",
            "data":{"utdid":utdid,"uuid":uuid,"imei0":imei0,"imei1":imei1,"imei":imei,"version":version,
            "vaid":vaid,"month":Number(month),"day":Number(day),"member_type":member_type,"chipset":Number(chipset),
            "city":city,"phone":phone,"order":order,'phoneModel':phoneModel,'expireDate':expireDate,'member_property':member_property}
          },function(err,data){
              var dataObject= JSON.parse(data);
              if (dataObject.code !== undefined){ //插入数据错误
                  _result.code = "A005";
                  _result.info = dataObject.error;
                  response.send(_result);
              }else { //{"createdAt":"2023-02-23 15:16:27","objectId":"a3256a1aa5"}
                  var moment = modules.oMoment;
                  var createdAt = moment(dataObject.createdAt);//.format('YYYY-MM-DD HH:mm:ss')
                  _result.code = "A1024";
                  _result.objectId = dataObject.objectId;
                  _result.createdAt = dataObject.createdAt;
                  _result.expireDate =  expireDate;
                  _result.member_type = member_type;
                  _result.utdid = utdid;
                  _result.updatedAt = dataObject.updatedAt;
                  _result.uuid = uuid;
                  response.send(_result);
              }
          });
    });

 
                                                                              
}