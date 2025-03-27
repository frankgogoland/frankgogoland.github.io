function onRequest(request, response, modules) {
  var db = modules.oData;
  var functions = modules.oFunctions;
  var gzip = modules.oGzip;
  var baseConfig = {
      "showPay" : false, //是否显示支付按钮，目前没有用
      "minVersionCode":86, //最小支持的版本，如果版本低于这个版本会提示退出
      "supportHisiNrLock":false, //是否支持海思芯片锁5G，目前需要后台开通，不开通显示"开发中”
      "supportTrpay":true,  //支持Trpay提供的支付功能。如果false则不能使用支付功能
      "preferenceKey":"#@#$$%%223345", //preference key 目前app没有用
      "trpayAppKey":"569e2cfd6c474aa0b2cfa1c08cde3821", // trpay key
      "trPayAppSecret":"appSceret=9829f1cba4994a0e80744524f7c28c97", //trpay secret
      "ossAccessKeyId":"LTAIZBON0iBFmogC", //阿里云OSS访问key
      "ossAccessKeySecret":"VtBqvQAlWjXfrSqszeHE5Xcs90q3o9", //阿里云OSS访问密钥
      "hisiPolicy":0, //海思策略。0：不限制，1：全部限制，2：限制非会员，3：限制非高级会员。如果限制则不再初始化HiAgent
      "qualcommPolicy":0, //0: 不限制  1：全部限制  2：限制非会员 3：限制非高级会员。限制后不会初始化diag
      "price":"18:180:398:108:308:1028", //价格列表，月度普通，年度普通，终身普通普通，月度高级，季度高级，年度高级
      "mate60_policy":3, //0:不支持，1：支持 3：支持开放锁频功能（但是需要后台单独开通高)  4:个性化配置，参考VipInfo 表 extra_config自定义
      "hisiCollectScheme":2, //海思采集方案 0: hiAgent ,1: ueservice 2: hiAgent first ,3: ueservice first
      "supportNewNrLockVer":"MPSS.DE.3.1;MPSS.DE.5;MPSS.DE.6;MPSS.DE.7", //支持新的nr pci锁定的高通基带版本
      "memCheckKeywords":"frida;xpose;substrate;vipkill" //检测第三方的破解的app关键字，分号隔开。

  }
  //广告平台
  var adConfig = {
       "lockAdSupport" : false, //锁LTE频点是否支持弹广告，目前不支持了
       "lockAdPolicy": 1,//锁频广告分类，// 1: 广点通插屏, 2: 广点通激励视频 ,4:穿山甲插屏，5：穿山甲视频。其他值不支持
       "signaling": 0, //看信令广告，目前不支持了
       "splashAdPolicy": 2,  //开屏广告策略 ：1 按时间 2 广点通优先 3 穿山甲优先
       "adIntervalTime": 5, //背景恢复到前台开启广告时长,单位分钟
        "csj": {   //穿山甲
            "appId": "5114361",
            "flashId": "887395070", //开屏广告id
            "interstitialId": "945716916", //插屏广告id
            "rewardId": "945716688", //激励视频id
            "status": 1  //是否启用,如果不启用可以不初始化
        },
        "gdt": {  //广点通，优量会
            "appId": "1210161456",
            "flashId": "9103890985018698",
            "interstitialId": "8165061392381036",
            "rewardId": "4143597937799355",
            "status": 1
        },
 
  }
  
  var _result = {
      "code":"" //错误码,A001,A002,A003,A003,A004,A005,A1024
  };
   _result.code = "A1024";
    _result.a = baseConfig.showPay;
    _result.b = baseConfig.minVersionCode;
    _result.c = baseConfig.supportHisiNrLock;
    _result.d = baseConfig.supportTrpay;
    _result.e = baseConfig.ossAccessKeyId;
    _result.f = baseConfig.ossAccessKeySecret;
    _result.g = baseConfig.hisiPolicy;
    _result.h = baseConfig.qualcommPolicy;
    _result.i = baseConfig.showTry;
    _result.j = baseConfig.price;
    _result.k = baseConfig.mate60_policy;
    _result.l = baseConfig.preferenceKey;
    _result.m = baseConfig.trpayAppKey;
    _result.n = baseConfig.trPayAppSecret;
    _result.o = baseConfig.supportNewNrLockVer;
    _result.p = baseConfig.hisiCollectScheme;
    _result.q = baseConfig.memCheckKeywords;
    _result.ad = adConfig;
   //  response.send(_result);
    gzip.gzip(JSON.stringify(_result)).then( (compressed) => {
         response.send(Buffer.from(compressed,'utf-8').toString('base64'));
    })
 
}