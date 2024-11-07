/*
普通用户续费 regBuy 续费
{
    "code": "A1024",
    "info": "",
    "createdAt": "",
    "expireDate": "2024-09-25 11:28:53",
    "objectId": "",
    "utdid": "",
    "uuid": "84f7ccf0-1b32-6a0d-bcfe-0f78388b74f5"
}
*/
function onRequest(request, response, modules) {
    var db = modules.oData;
    var httpType = request.method;
    var objectId;
    var month;
    var day;
    var member_type;
    var utdid;
    var order;
    var version;
    var phoneModel;
    var member_property;
   if ("GET" == httpType) {
       utdid = request.query.utdid;
       objectId = request.query.objectId;
       month = request.query.month;
       day = request.query.day;
       member_type = request.query.member_type;
       order = request.query.order;
       version = request.query.version;
       phoneModel = request.query.phoneModel;
       member_property = request.query.member_property;
    }else {
        utdid = request.body.utdid;
       objectId = request.body.objectId;
       month = request.body.month;
       day = request.body.day;
       member_type = request.body.member_type;
       order = request.body.order;
       version = request.body.version;
       phoneModel = request.body.phoneModel;
       member_property = request.body.member_property;
   }
   if (day === undefined) day = 0;
   if (month === undefined) month = 0;
   if (member_property === undefined) member_property = "";
   
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
   
   if (member_type === undefined) {
       _result.code = "A001";
       _result.info = "need member_type";
       response.send(_result);
   }
//   order = "GPA.33"
//   if (order.startsWith("GPA.33")) {
//         _result.code = "A002"
//         _result.info = "error";
//         response.send(_result);
//   }else {
//         _result.code = "A004"
//         _result.info = "error";
//         response.send(_result);
//   }

  db.findOne({
    "table":"VipInfo",
    "objectId":objectId
  },function(err,data){ //网络错误err不等于null，找不到记录，表不存在err为null，data返回记录肿保护error字段和code字段
        //response.send("data :" + data + ",err = " + err); //data :{"code":101,"error":"object not found for 23bcb195cc."},err = null
        var dataObject= JSON.parse(data);
        if (dataObject.code !== undefined || objectId === "ab9594c45f" || objectId == "7cef86d386") {
            _result.code = "A002"
            _result.info = dataObject.error;
            response.send(_result);
            return;
        }
       // var dataObject= JSON.parse(data);
        var _day = dataObject.day;
        var _month = dataObject.month;
        var moment = modules.oMoment;
        var _order = dataObject.order;
        var createdAt = moment(dataObject.createdAt);//.format('YYYY-MM-DD HH:mm:ss')
        var expireDate = createdAt.add(_day, 'days').add(_month, 'months'); //这个操作之后createAt的值会变化，坑爹
        var hasExpired = 0;
        // response.end("expireDate = " +  moment(dataObject.createdAt).format('YYYY-MM-DD HH:mm:ss') + ",_day = " + _day + ",_month = " + month);
        if (expireDate >= moment()) { //有效期内
            //首先分析是否是会员升级
            if (dataObject.member_type == "g" && member_type == 's') {
                //会员升级
                if(_month >= 120) { //终极普通会员,不再折算，用户高级会员过期后联系管理员恢复
                     _day = moment(moment()).diff(moment(dataObject.createdAt), 'days') + 1;//需要补齐到当前日期,当前时间 - 创建时间
                     _month = Number(month);//增加会员的月份
                     
                }else {
                    var paddingDay =  moment(moment()).diff(moment(dataObject.createdAt), 'days'); //补齐的天数
                    var diff = moment(expireDate).diff(moment(),'days');  //过期日期 - 当前日期
                    var ratio = 6.5;
                    var extra = diff > ratio ? 0 : 1;
                    _day = diff / ratio + extra;
                    _day = Math.round(_day) + paddingDay; //折算的天数  + 补齐的天数
                    _month = Number(month);  //当前的月份，之前的月份字段置为0
                }
            }else {
                _day += Number(day);
                _month += Number(month);
            }
           // response.end("createdAt = " + createdAt.format('YYYY-MM-DD HH:mm:ss') + ", day = " + day + ",month = " + month);
  
        }else {
            //response.end();
            var diffDays = moment(moment()).diff(moment(dataObject.createdAt), 'days'); //已经过期了，需要补齐到当前日期
            //response.end("need append diff days = " + diff);
            _day  = diffDays + Number(day);
            _month = Number(month);
            hasExpired = 1;
           // response.end("need append diff days = " + diffDays + ",now month = " + _month + ",now day = " + _day + "createdAt = " + moment(dataObject.createdAt).format('YYYY-MM-DD HH:mm:ss'));
        }
        
        if (order !== undefined) {
             var current_time = moment(moment()).format('YYYY-MM-DD_HH:mm:ss');//.format('YYYY-MM-DD HH:mm:ss')
             order += "&&" + current_time
            if (_order === undefined || _order === null || _order === "") { //原始记录为null
                _order = order;
            }else {
                 _order = _order + ";" + order;
            }
        }
     
       
       var functions = modules.oFunctions;
       functions.run({
          "name": "generateUUID",
          "data":null
        },function(err,data){
          //回调函数
        var uuid = data;
       if (hasExpired === 1) uuid = "1024"
        var createdAt = moment(dataObject.createdAt);//.format('YYYY-MM-DD HH:mm:ss')
        var expireDate = createdAt.add(_day, 'days').add(_month, 'months').format('YYYY-MM-DD HH:mm:ss');
       // response.end("need append diff days = " + diffDays + ",now month = " + _month + ",now day = " + _day + ",expireDate = " + expireDate);
        db.update({
        "table":"VipInfo",
        "objectId":objectId,
        "data":{"day":_day,"month":_month,'member_type':member_type,'uuid':uuid,'order':_order,'phoneModel':phoneModel,
        'expireDate':expireDate,'version':version,'member_property':member_property}
         },function(err,data){
          //   _dataObject= JSON.parse(data);
              if (data.code === undefined) {
                  //createdAt = moment(dataObject.createdAt);//必须重新赋值一次
                  _result.code = "A1024";
                  _result.updatedAt = data.updatedAt;
                  _result.objectId = objectId;
                  _result.utdid = dataObject.utdid;
                  _result.expireDate = expireDate;
                  _result.member_type = member_type;
                  _result.uuid = uuid;
                  response.send(_result);
              }
              else { //更新表错误
                    _result.code = "A006";
                    _result.info = dataObject.error;
                    response.send(_result);
              }
          });
        });
  });
  
}