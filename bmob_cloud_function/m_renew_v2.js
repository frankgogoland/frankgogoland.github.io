/*
普通用户续费 2024-10-10 接收数据是经过Gzip压缩的，返回的数据是base64加密的
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
    var gzip = modules.oGzip;
    var functions = modules.oFunctions;
    if ("GET" == httpType) {
       _result.code = "A001";
       _result.info = "Other error";
       response.send(Buffer.from(JSON.stringify(_result),'utf-8').toString('base64'));

    }else {
             //objectId = request.body.objectId;
       body = request.body.data;
       var gzipedData = Buffer.from(body, "base64");
       gzip.ungzip(gzipedData).then( (decompressed) => {
       //response.end(decompressed.toString()); 
       var dataObject= JSON.parse(decompressed.toString());
       functions.run({
                  "name": "m_renew",
                  "data":{"objectId":dataObject.aa,"imei0":dataObject.bb,"imei1":dataObject.cc,
                  "imei":dataObject.dd,"month":dataObject.ee,"day":dataObject.ff,"order":dataObject.gg,
                  "member_type":dataObject.hh,"phoneModel":dataObject.ii,"version":dataObject.jj,"vaid":dataObject.kk   
                  }
                },function(err,data){
                    var dataObject= JSON.parse(data);
                    response.send(Buffer.from(JSON.stringify(dataObject),'utf-8').toString('base64'));
                });
                    
       
       });
   }
  
  
}