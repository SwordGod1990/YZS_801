//本地请求ip
//var commonUrl = 'http://192.168.30.246:8080/';      //陈志龙
  // var commonUrl = 'http://192.168.30.64:8080/';      //胡军宝
//var commonUrl = 'https://test-mqps.zhiyiyunzhenshi.com/';      //测试地址
 // var commonUrl = 'http://192.168.30.222:8081/';      //信恒涛
//var commonUrl = 'https://local-mqps.zhiyiyunzhenshi.com/';      //开发
//var commonUrl = 'http://192.168.31.249:8080/';  //陈少华
 // var commonUrl = 'http://192.168.29.186:8080/';      //黄记
//var clinicCloudUrl = 'http://local-app.zhiyiyunzhenshi.com/mqpsLoadClinicInfo/';//贾世昌 【创建询价单-右侧药品列表】
//var clinicCloudUrl = 'http://192.168.31.27:8083/clinicpad/mqpsLoadClinicInfo/';//翟艾雪【创建询价单-右侧药品列表】
//var clinicCloudUrl = 'http://192.168.31.196:8083/pharmacy/mqpsLoadClinicInfo/';//卢天骄【创建询价单-右侧药品列表】 开发环境



// http://local-app.zhiyiyunzhenshi.com/    贾世昌
//正式  测试  开发
//var commonUrl = https://mqpsapi.yunzhenshi.com     // 正式

 //var clinicCloudUrl = 'http://test4.zhiyiyunzhenshi.com/pharmacy/mqpsLoadClinicInfo/';//卢天骄【创建询价单-右侧药品列表】 测试环境

// var clinicCloudUrl = 'http://192.168.14.76:8080/pharmacy/mqpsLoadClinicInfo/';//翟艾雪【创建询价单-右侧药品列表】 测试环境
// var commonUrl = https://local-mqps.zhiyiyunzhenshi.com  // 开发


//  var commonUrl = 'https://test-mqps.zhiyiyunzhenshi.com/'// 测试
var commonUrl = 'http://192.168.29.166:8085/'
 var clinicCloudUrl = 'http://192.168.14.76:8080/pharmacy/mqpsLoadClinicInfo/';//卢天骄【创建询价单-右侧药品列表】 测试环境


// var commonUrl = 'https://m.zhiyijiankang.com/' //正式环境接口;
// var clinicCloudUrl = 'http://pharmacy.yunzhenshi.com/mqpsLoadClinicInfo/';//正式已修改 【创建询价单-右侧药品列表】


//html页面url取参数

function UrlSearch () {
    var name;
    var value;
    var str = location.href;
    var num = str.indexOf("?");

    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        }
    }
}
var params = new UrlSearch();
//var hjbUrl='http://192.168.31.236:8080/';


// 点击非目标区域，收起目标盒子
function documents(classname,elehide){
    $(document).ready(function(){
        $(document).on('click', function(e){
            e = e || window.event;
            if(document.all){  //只有ie识别
                e.cancelBubble=true;
            }else{
                e.stopPropagation();
            }
            if($(e.target)[0].className == classname)
                return;
            $(elehide).hide();
        });
    });
}

function getUrlValue(url, kValue) {//截取url中的参数
    var reg = /([^?&=]+)=([^?&=]+)/g, obj = {}, str = url;
    url.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    })
    for (var keyName in obj) {
        if (keyName == kValue) {
            return obj[keyName];
            break;
        }
    }
}



//吐司提示
function toastBox(content){
    $(".dialogue_alert").show();
    $(".alert").html(content);
    setTimeout('$(".dialogue_alert").fadeOut()', 2000);
}

//和原生交互的返回
function goBack(){
    //调用 ios方法
    //toastBox(1)
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //toastBox(2)

        window.webkit.messageHandlers.closefullCallback.postMessage("closefullCallback");
        //调用 安卓 方法
    } else if (/(Android)/i.test(navigator.userAgent)) {
        android.go_back();
        //pc
    } else {
        window.csfunction();  //这个方法是  陈宏亮   给的
    };
}



//限制输入的字数为int位整数float位小数,输入4位整数，两位小数
function amount(v) {
    var regStrs = [
        ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
        ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
        ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
        ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
    ];
    for (i = 0; i < regStrs.length; i++) {
        var reg = new RegExp(regStrs[i][0]);
        v = v.replace(reg, regStrs[i][1]);
    }
    return v;
}


