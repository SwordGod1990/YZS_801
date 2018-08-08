
var getlocalStorage={//取值
    "clinicIdVal":localStorage.getItem("clinicIdStorage"),
    "clinicNameVal":localStorage.getItem("clinicNameStorage"),
    "doctorIdVal":localStorage.getItem("clinicEmployIdStorage"),
    "doctorNameVal":localStorage.getItem("realNameStorage")
}
// var getlocalStorage={//取值
// "clinicIdVal":"110288f4a5160a0520151656ed0panda",
// "clinicNameVal":"修改开发研发中心测试诊所3",
// "doctorIdVal":"30288f4a5160a0520151656ed0panda1",
// "doctorNameVal":"李涛2号"
// }
var groupLabelId ="" ,searchVal="",page = 1;//标签分组id
searchAndLoad(groupLabelId,searchVal,1);
var flagDate='';
var flagUrl='';
function searchAndLoad(groupLabelId,searchVal,flagVal){
    if(flagVal==1||flagVal==''||flagVal==undefined||flagVal==null){
        console.log(11)
        flagUrl=clinicCloudUrl + 'mqpsLoadClinicCommodity';
         flagDate={
            "clinicId":getlocalStorage.clinicIdVal,// 切记：改成变化id
            //"clinicId":"110288f4a5160a0520151656ed0panda",// 切记：改成变化id
            "clinicLabelId": groupLabelId,//如果是全部药品请空着 如果其他标签 取标签id
            "coditions": searchVal,//如果搜索框已填写 获取填写的内容
            "pageStart": page,//页数必填，可以做成滑动一次+1
            "pageNum": "20"//每页显示条数
        }
    }else if(flagVal==2){
        console.log(222)
        flagUrl=clinicCloudUrl + 'inventoryReminder';
        flagDate={
            "clinicId":getlocalStorage.clinicIdVal,// 切记：改成变化id
//            "clinicId":"8a990d915a892f94015aa759e12a3f90",// 切记：改成变化id
            //"clinicId":"110288f4a5160a0520151656ed0panda",// 切记：改成变化id
            "coditions": searchVal,//如果搜索框已填写 获取填写的内容
            "sysUserId":getlocalStorage.doctorIdVal,
//            "sysUserId":"8a990d915a892f94015aa75a3e1340d3",
            "pageStart": page,//页数必填，可以做成滑动一次+1
            "pageNum": "20"//每页显示条数

        }
    }
    //药品加载
    $.ajax({
        url:flagUrl,
        type: 'post',
        async: false,
        data: flagDate,
        success: function (datas) {
            var data = JSON.parse(datas);
            console.log(data)
            console.log("右侧药品列表信息data:", data);
            if (data.code == "0000") {
                var result = '';
                for (var i = 0; i < data.data.length; i++) {
                    console.log(data)
                    for (var j = 0; j <data. data[i].groupList.length; j++) {
                        var glist = data.data[i].groupList[j]
                        result += '<div class="drugList medicine_center">' +
                            '<div class="drugMessage"> ' +
                            '<h2 data_id="' + glist.id + '" class="ellipsis">' + glist.cname + '</h2>'+
                            '<p class="spec ellipsis">'

                        if($.trim(glist.specifcations)!="null"){
                            result += '<em class="specifcations">'+glist.specifcations+'</em>'
                        }else{
                            result += '<em class="specifcations"></em>'
                        }
                        if($.trim(glist.specifcations)!="" && $.trim(glist.specifcations)!="null" && $.trim(glist.matrix)!=""){
                            result +='*'
                        }
                        result +='<em class="matrix">'+glist.matrix +'</em><em class="minUnit">' + glist.minUnit + '</em>'
                        if($.trim(glist.minUnit) && $.trim(glist.commonUnit)){
                            result +='/'
                        }
                        result +='<em class="commonUnit">' + glist.commonUnit + '</em>'+'</p>'
                        if($.trim(glist.factory)!="null"){
                            result += '<p class="factory ellipsis">' + glist.factory + '</p>'
                        }else{
                            result += '<p class="factory ellipsis"></p>'
                        }
                        result +='</div>' +
                            '<div class="drugHandle medicine_center_left">'

                        var inventoryNum="";
                        if(glist.amount.slice(0,1)=="-"){
                            result +='<div class="drugInventory drugInventoryRed medicine_center_left">'
                        }else{
                            result +='<div class="drugInventory medicine_center_left">'
                        }

                        result +='<div class="iconBox"></div>' +
                            '<p class="inventoryNum">' + glist.amount + '</p>'+
                            '</div> ' +
                            '<div class="drugAdd"><i class="drugAddIcon"></i></div>' +
                            '</div>' +
                            '</div>'
                    }
                }
                if(page==1){
                    $(".drugListWrap").html("");
                    $(".drugListWrap").empty();
                }
                $(".drugListWrap").append(result);
                //暂无数据
                if(data.data.length==0 && $(".drugListWrap").html()==""){
                    $(".drugListWrap").html("<div class='nodataList'>暂无数据</div>");
                }
            } else {
                //$(".drugListWrap").html("<div class='nodataList'>暂无数据</div>");
            }
        },
        error: function () {
            //alert("接口mqpsLoadClinicCommodity请求失败！");
            toastBox("请求失败");
        }
    });
}

//点击库存提醒
$(document).on("click",".typeTip",function(){
    console.log(123456)
    page=1;
    searchAndLoad(groupLabelId,searchVal,2);
})
// $(".searchInput").on("blur",function(){
//     $(".drugHead_title").html("厚度会问");
//     $(".numberFocus").focus();
//     $(".searchInput").val($(".numberFocus").val())
// })
// $(".drugHead_title").html("获取焦点");
// $(".searchInput").focus();

//    扫码枪
$(".barcode").on("click",function(){
    $(this).find(".barcodeIcon").removeClass("barcodeIcon_default");
    $(this).find(".barcodeText").removeClass("barcodeText_default");
    //扫码枪调用IOS客户端代码
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
//        $(".drugHead_title").html("IOS1");
        window.webkit.messageHandlers.scanReanderCallback.postMessage("scanReanderCallback");
        //调用 安卓 方法
    } else if (/(Android)/i.test(navigator.userAgent)) {
//        $(".drugHead_title").html("Androids");
        android.scanQRcode();
        //pc
    } else {

//                    window.history.go(-1)
    };
});


if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    //IOS扫码枪扫描二维码获取二维码药品参数
    function reserviceQRNum(obj){
        $(".searchInput").val(obj);
        searchAndLoad(groupLabelId,obj);
    }
    //调用 安卓 方法
} else if (/(Android)/i.test(navigator.userAgent)) {
    function setQRcode(msg){
//        $(".drugHead_title").html("Androide");
        $(".searchInput").val(msg);
        searchAndLoad(groupLabelId,msg);
    }
    //pc
} else {
    //pc连接扫码枪
    function setbarcode(barcode){    //pc  陈宏亮  给的方法
//        $(".drugHead_title").html(1111);
        $(".searchInput").val(barcode);
        searchAndLoad(groupLabelId,barcode) ;
    }
    function barcodeStatus(flag){  //判断扫码枪是否连接
        if(flag==1){      //已连接
            $(".barcode").addClass("barcodeBlue");
        }else{           //未连接
            $(".barcode").removeClass("barcodeBlue");//去掉就变成灰色的扫码枪
        }
    }
};


/*创建询价单*/
$(function () {
    //toastBox("诊所id："+localStorage.getItem("clinicIdStorage")+"，clinicId:"+getlocalStorage.clinicIdVal+"，doctorId:"+getlocalStorage.doctorIdVal)
    //获取询价单id
    var url=window.location.href;  //获取询价单页面传过来的询价单id
    var enquiryOrderIdNum=getUrlValue(url,"enquiryIdEdit");
    //收货人信息展示
    var provinceCode="",cityCode="",areaCode="",provinceName="",cityName="",areaName="",adressName="",adressDetail="";
    $.ajax({
        url:commonUrl+'enquiryOrder/newClinicAddress',
        type:'post',
        async:false,
        data:{
            'clinicId':getlocalStorage.clinicIdVal,// 切记：改成变化id
            'doctorId':getlocalStorage.doctorIdVal// 切记：改成变化id
        },
        success:function(datas){
            var data = JSON.parse(datas);
            console.log("收货人信息展示data:",data);
            if(data.code=="0000"){
                if($.trim(data.data.consigneeName)!=""){
                    $(".drugNameWrap .name").text(data.data.consigneeName);
                    $(".drugNameWrap .nameDefault").hide();
                }else{
                    $(".drugNameWrap .nameDefault").show();
                }
                $(".drugNameWrap .numberMl").text(data.data.consigneePhone);
                provinceCode=data.data.provinceCode;
                cityCode=data.data.cityCode;
                areaCode=data.data.areaCode;
                provinceName=data.data.province;
                cityName=data.data.city;
                areaName=data.data.area;
                if($.trim(provinceName)!=""||$.trim(cityName)!=""||$.trim(areaName)!=""){
                    $(".adressNameDefault").hide();
                }
                $(".titleAdress .adressName .proName").text(provinceName);
                $(".titleAdress .adressName .cityName").text(cityName);
                $(".titleAdress .adressName .areaName").text(areaName);
                $(".titleAdress .adressName").attr({"data_codePro":provinceCode,"data_codeCity":cityCode,"data_code":areaCode});
                $(".titleAdress .adressDetail").text(data.data.consigneeAddress);

            }else if(data.code=="0001"){
                alert(data.msg);
                //toastBox("收货人信息展示："+data.msg)
            }
        },
        error:function(){
            alert("接口enquiryOrder/newClinicAddress请求失败！");
        }
    });
    //询价单：预购药品信息展示
    var medicinalIdArr=[],//药品ID
        medicinalNameArr=[],//药品名称
        normsArr=[],//规格
        medicinalCompanyNameArr=[],//生产厂家
        numArr=[],//药品数量
        unitArr=[],//药品单位
        smallUnitArr=[],//药品小单位
        scalerArr=[];//换算量
    if(enquiryOrderIdNum){//编辑
        $.ajax({
            url:commonUrl+'enquiryOrder/queryEnquiryOrderInfo',
            type:'post',
            async:false,
            data:{
                //'enquiryOrderId':'40289f6c6229c2cd016229c2fb430000'// 切记：改成变化id
                'enquiryOrderId':enquiryOrderIdNum// 切记：改成变化id
            },
            success:function(datas){
                var data = JSON.parse(datas);
                console.log("询价单：预购药品信息展示data:",data);
                if(data.code=="0000"){
                    $(".leaveWord .leaveWordArea").val(data.date.words);//留言
                    $(".clinicName").val(data.date.clinicName);//诊所名称
                    $(".doctorId").val(data.date.doctorId);//医生ID
                    $(".doctorName").val(data.date.doctorName);//医生名称
                    var result="";
                    for(var i=0;i<data.date.goodsList.length;i++){
                        result+='<li class="medicine_center">'+
                            '<div class="drugMessage">'+
                            '<h2 data_id="'+ data.date.goodsList[i].medicinalId +'" class="ellipsis">'+ data.date.goodsList[i].medicinalName +'</h2>'+
                            '<p class="spec ellipsis">'

                        if($.trim(data.date.goodsList[i].norms)!="null"){
                            result += '<em class="specifcations">'+data.date.goodsList[i].norms+'</em>'
                        }else{
                            result += '<em class="specifcations"></em>'
                        }
                        if($.trim(data.date.goodsList[i].norms)!="" && $.trim(data.date.goodsList[i].norms)!="null" && $.trim(data.date.goodsList[i].scaler)!=""){
                            result +='*'
                        }
                        result +='<em class="matrix">'+data.date.goodsList[i].scaler +'</em><em class="minUnit">' + data.date.goodsList[i].smallUnit + '</em>'
                        if($.trim(data.date.goodsList[i].smallUnit) && $.trim(data.date.goodsList[i].unit)){
                            result +='/'
                        }
                        result +='<em class="commonUnit">' + data.date.goodsList[i].unit + '</em>'+'</p>'

                        if($.trim(data.date.goodsList[i].medicinalCompanyName)!="null"){
                            result += '<p class="factory ellipsis">' + data.date.goodsList[i].medicinalCompanyName + '</p>'
                        }else{
                            result += '<p class="factory ellipsis"></p>'
                        }

                        result +='</div>'+
                            '<div class="drugHandle medicine_center">'+
                            '<div class="drugCount medicine_center">'+
                            '<span class="jian medicine_center"><i class="jianIcon"></i></span>'+
                            '<input type="tel" value="'+ data.date.goodsList[i].num +'" class="num_input" maxlength="4">'+
                            '<span class="jia medicine_center"><i class="jiaIcon"></i></span>'+
                            '</div>'+
                            '<div class="drugDel"><i class="drugDelIcon"></i></div>'+
                            '</div>'+
                            '<input type="hidden" class="specifcationsunit" value="'+ data.date.goodsList[i].norms +'"/>'+
                            '<input type="hidden" class="unit" value="'+ data.date.goodsList[i].unit +'"/>'+
                            '<input type="hidden" class="smallUnit" value="'+ data.date.goodsList[i].smallUnit +'"/>'+
                            '<input type="hidden" class="scaler" value="'+ data.date.goodsList[i].scaler +'"/>'+
                            '</li>'

                    }
                    $(".purchaseDrug").append(result);
                }else if(data.code=="0001"){
                    alert(data.msg);
                }
            },
            error:function(){
                alert("接口enquiryOrder/queryEnquiryOrderInfo请求失败！");
            }
        });
    }else{//新建
        $(".drugNoDataWrap").show();
        $(".purchaseDrug").hide();
    }
    //预购药品删除
    $(".purchaseDrug").on("click",".drugDel",function(){
        var purchaseDrugLi=$(this).parent().parent(),purchaseDrug=purchaseDrugLi.parent(".purchaseDrug"),purchaseDrugLiLen=purchaseDrug.children("li").length;
        if(purchaseDrugLiLen==1){//如果没有数据了，展示无数据样式
            purchaseDrug.hide();
            $(".drugNoDataWrap").show();
            $(".drugTotal2").text("0");
            $(".drugTotal1").text("0");
        }
        $(this).parent().parent().remove();//删除当前药品
        numCount();
        //扫码枪input失去焦点，调用原生重新获取焦点
        //扫码枪调用IOS客户端代码
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
    });

    /**********************************右侧云诊室药品加载***********************************************/

    //滚动时加载数据
    document.getElementById("searchBox").onscroll = function(){   //下拉加载
        var t = document.getElementById("searchBox").scrollTop;  //离上方的距离
        var h =document.getElementById("searchBox").innerHeight || document.getElementById("searchBox").clientHeight; //可见宽度
        // console.log("t:",t,"h:",h)
        if( t >= document.getElementById("searchBox").scrollHeight -h ) {
            if($(".typeTip").attr("class")=="typeLi typeTip typeLiCur"){
                page++;
                console.log(page)
                searchAndLoad(groupLabelId,$(this).val(),2);
                console.log(5)
            }else{
                page++;
                console.log(page)
                searchAndLoad(groupLabelId,$(this).val());
                console.log(6)
            }
        }
    }
    //药品标签加载
    var drugpage=1;
    function drugContent(){
        console.log(93)
        $.ajax({
            url: clinicCloudUrl + 'mqpsLoadCommodityLabel',
            type: 'post',
            async: false,
            data: {
            "clinicId":getlocalStorage.clinicIdVal,// 切记：改成变化id
//             "clinicId":"8a990d915e8121aa015e9e1e5b2454ec",// 切记：改成变化id
                "pageStart": drugpage,//页数必填，可以做成滑动一次+1
                "pageNum": "20"//每页显示条数
            },
            success: function (datas) {
                var data = JSON.parse(datas);
                console.log("药品标签加载data:", data);
                if (data.code == "0000") {
                    var result = ''
                    for (var i = 0; i < data.data.length; i++) {
                        result += '<li class="typeLi" data-id ="'+data.data[i].id +'">'+ data.data[i].labelName +'</li> '
                    }
//                    $(".typeList").empty();
                    $(".typeList").append(result);
                } else {
                    alert();
                }
            },
            error: function () {
                //alert("接口mqpsLoadClinicCommodity请求失败！");
                toastBox("请求失败");
            }
        });
    }

    //滚动时加载数据
    document.getElementById("drugTab").onscroll = function(){   //下拉加载
        var t = document.getElementById("drugTab").scrollTop;  //离上方的距离
        var h =document.getElementById("drugTab").innerHeight || document.getElementById("drugTab").clientHeight; //可见宽度
        // console.log("t:",t,"h:",h)
        if( t >= document.getElementById("drugTab").scrollHeight -h ) {
            console.log( 9666)
            drugpage++;
            console.log(drugpage)
            drugContent();
        }
    }

    drugContent();

    //标签切换
    $(".typeList").on("click","li",function () {
        if(!$(this).hasClass("typeLiCur")){
            page=1;
            $(this).addClass("typeLiCur").siblings().removeClass("typeLiCur");
            groupLabelId=$(this).attr("data-id");
            searchAndLoad(groupLabelId,$(".searchInput").val());
        //扫码枪input失去焦点，调用原生重新获取焦点
        //扫码枪调用IOS客户端代码
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
        }
    })
    //搜索
    $(".searchInput").bind("input propertychange", function () {//监听value值的变化
        if($(".typeTip").attr("class")=="typeLi typeTip typeLiCur"){
            page=1;
            searchAndLoad(groupLabelId,$(this).val(),2)
        }else{
            page=1;
            searchAndLoad(groupLabelId,$(this).val())
        }

    });
  /*  $(".searchInput").click(function () {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
    })*/
    $(".searchInput").focus(function () {
        $(".searchInputClear").show();

    }).blur(function () {
        if ($(".searchInput").val() == "") {
            $(".searchInputClear").hide();
        }
    });
    $(".searchInputClear").click(function () {
        console.log("qqqq");
        $(".searchInput").val("");
        $(".searchInputClear").hide();
        searchAndLoad(groupLabelId,searchVal);
        //扫码枪input失去焦点，调用原生重新获取焦点
        //扫码枪调用IOS客户端代码
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
    });

    /***********************************云诊室药品搜索end*******************************************************/

    //预购药品底部数量初始化
    numCount();
    //预购药品加减
    $(".purchaseDrug").on("click",".jia", function () {
        var jia=$(this),num_input=jia.siblings(".num_input");
        if(num_input.val()>=9994){
            num_input.val(parseInt(9999));
            toastBox("最多只能采购9999件")
        }else{
            num_input.val(parseInt(num_input.val())+5);
        }
        numCount();
        
        //扫码枪input失去焦点，调用原生重新获取焦点
        //扫码枪调用IOS客户端代码
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
    });
    $(".purchaseDrug").on("click",".jian", function () {
        var jian=$(this),num_input=jian.siblings(".num_input");
        if(num_input.val()<=1){
            //num_input.val(parseInt(1));
            toastBox("数量不可为0")
        }else{
            num_input.val(parseInt(num_input.val())-1);
        }
        numCount();
        //扫码枪input失去焦点，调用原生重新获取焦点
        //扫码枪调用IOS客户端代码
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
    });
    $(".purchaseDrug").on("input propertychange",".num_input",function() {//监听value值的变化
        numCount();
    });
    //药品选择点击添加
    $(".searchBox").on("click",".drugList", function () {//之前写的drugAdd为点击区域。需求临时改为drugList为点击区域
        var drugAdd=$(this).find(".drugAdd"),
            drugMessage=drugAdd.parent().siblings(".drugMessage"),
            h2=drugMessage.find("h2"),
            spec=drugMessage.find(".spec"),
            factory=drugMessage.find(".factory"),
            idNowVal=h2.attr("data_id"),
            unit =drugMessage.find(".commonUnit"),
            smallUnit =drugMessage.find(".minUnit"),
            scaler =drugMessage.find(".matrix"),
            specifcations=drugMessage.find(".specifcations"),
            arr=[];
        if($(".purchaseDrug li").length==0){//如果左侧没有药品
            $(".drugNoDataWrap").hide();
            $(".purchaseDrug").show();
            console.log("如果左侧没有药品");
            $(".purchaseDrug").prepend(
                '<li class="medicine_center">'+
                '<div class="drugMessage">'+
                '<h2 data_id="'+ idNowVal +'" class="ellipsis">'+ h2.text() +'</h2>'+
                '<p class="spec ellipsis">'+ spec.text() +'</p>'+
                '<p class="factory ellipsis">'+ factory.text() +'</p>'+
                '</div>'+
                '<div class="drugHandle medicine_center">'+
                '<div class="drugCount medicine_center">'+
                '<span class="jian medicine_center"><i class="jianIcon"></i></span>'+
                '<input type="tel" value="5" class="num_input" maxlength="4">'+
                '<span class="jia medicine_center"><i class="jiaIcon"></i></span>'+
                '</div>'+
                '<div class="drugDel"><i class="drugDelIcon"></i></div>'+
                '</div>'+
                '<input type="hidden" class="specifcationsunit" value="'+ specifcations.text() +'"/>'+
                '<input type="hidden" class="unit" value="'+ unit.text() +'"/>'+
                '<input type="hidden" class="smallUnit" value="'+ smallUnit.text() +'"/>'+
                '<input type="hidden" class="scaler" value="'+ scaler.text() +'"/>'+
                '</li>'
            );
        }else if($(".purchaseDrug li").length==99){
            toastBox("最多可添加99种药品");
            return false;
        }else{
            console.log("如果左侧存在药品");
            var purchaseDrugH2;
            $(".purchaseDrug .drugMessage h2").each(function(index,item){
                var idVal="";
                idVal=$(this).attr("data_id");
                arr.push(idVal);
                if(idVal==idNowVal){
                    purchaseDrugH2=$(this);
                }
            });
            if(arr.in_array(idNowVal)){
                console.log("如果数组中存在药品");
                var oldVal=0;
                oldVal=parseInt(purchaseDrugH2.parent().siblings().find(".num_input").val());
                if(oldVal+5<9999){
                    oldVal=oldVal+5;
                    purchaseDrugH2.parent().siblings().find(".num_input").val(oldVal);
                }else{
                    purchaseDrugH2.parent().siblings().find(".num_input").val("9999");
                    return false;
                }
            }else{
                console.log("如果数组中不存在药品");
                $(".purchaseDrug").prepend(
                    '<li class="medicine_center">'+
                    '<div class="drugMessage">'+
                    '<h2 data_id="'+ idNowVal +'" class="ellipsis">'+ h2.text() +'</h2>'+
                    '<p class="spec ellipsis">'+ spec.text() +'</p>'+
                    '<p class="factory ellipsis">'+ factory.text() +'</p>'+
                    '</div>'+
                    '<div class="drugHandle medicine_center">'+
                    '<div class="drugCount medicine_center">'+
                    '<span class="jian medicine_center"><i class="jianIcon"></i></span>'+
                    '<input type="tel" value="5" class="num_input" maxlength="4">'+
                    '<span class="jia medicine_center"><i class="jiaIcon"></i></span>'+
                    '</div>'+
                    '<div class="drugDel"><i class="drugDelIcon"></i></div>'+
                    '</div>'+
                    '<input type="hidden" class="specifcationsunit" value="'+ specifcations.text() +'"/>'+
                    '<input type="hidden" class="unit" value="'+ unit.text() +'"/>'+
                    '<input type="hidden" class="smallUnit" value="'+ smallUnit.text() +'"/>'+
                    '<input type="hidden" class="scaler" value="'+ scaler.text() +'"/>'+
                    '</li>'
                );
            }
        }
        numCount();
        //扫码枪input失去焦点，调用原生重新获取焦点
        //扫码枪调用IOS客户端代码
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
    });
    //num_input药品数量校验
    $(".purchaseDrug").on("input propertychange",".num_input", function () {//监听value值的变化
        console.log("$(this).val():",$(this).val())
        if($(this).val()==0){
            $(this).val("");
            numCount();
        }
    });
    $(".purchaseDrug").on("blur",".num_input", function () {//失去焦点input为空时
        console.log("失去焦点input为空时$(this).val():",$(this).val())
        if($(this).val()==""){
            $(this).val("5");
            numCount();
        }
    });
    function numCount(){//计算预购药品数量
        var drugTotal1= 0,drugTotal2=0;
        $(".num_input").each(function(index,item){
            var r = /^-?\d+$/ ;//正整数
            if($(this).val() !=''&&!r.test($(this).val())){
                $(this).val("");  //正则表达式不匹配置空
            }else if($(this).val() !=''){
                console.log("计算数量：",index,item)
                drugTotal2+=parseInt($(this).val());
                drugTotal1=index+1;
            }
            $(".drugTotal2").text(drugTotal2);
            $(".drugTotal1").text(drugTotal1);
        });
    }
    //判断数组是否包含某个元素
    Array.prototype.S = String.fromCharCode(2);
    Array.prototype.in_array = function(e) {
        var r = new RegExp(this.S+e+this.S);
        return (r.test(this.S+this.join(this.S)+this.S));
    }
    /*var arr=["a","b"];
    alert(arr.in_array("a"));*/
    //预购药品保存
    $(".preserve,.confirmPre,.enjoy").click(function () {

        console.log("123")
        var thisText=$(this).text();
        console.log("预购药品信息校验")
        var name=$(".drugNameWrap .name").text(),
            number=$(".drugNameWrap .numberMl").text(),
            titleAdressText1=$(".titleAdress  .adressName").text(),
            titleAdressText2=$(".titleAdress  .adressDetail").text(),
            leaveWordArea=$(".leaveWord .leaveWordArea").val();
        if(name==""||name=="姓名"){
            toastBox("请填写收货人的姓名");
            return false;
        }
        if(number==""||number=="手机号码"){
            toastBox("请填写收货人的手机号码");
            return false;
        }
        if(titleAdressText1=="请填写收货地址"||titleAdressText1==""){
            console.log("主页面不是弹窗请填写收货地址")
            toastBox("请选择地址");
            return false;
        }
        if(titleAdressText2==""){
            toastBox("请填写详细地址");
            return false;
        }
        if(leaveWordArea.length>200){
            toastBox("留言不能超过200个字符");
            return false;
        }
        if($(".purchaseDrug li").length==0){
            toastBox("预购药品不能为空");
            return false;
        }
        //重复提交
        var nowTime = new Date().getTime();
        var clickTime = $(this).attr("ctime");
        if( clickTime != 'undefined' && (nowTime - clickTime < 5000)){
            toastBox("操作过于频繁，稍后再试");
            return false;
        }else{
            $(this).attr("ctime",nowTime);
        }
        $(".purchaseDrug li").each(function(index,item){
            var thisLi=$(this),
                medicinalId=thisLi.find(".drugMessage h2").attr("data_id"),//药品ID
                medicinalName=thisLi.find(".drugMessage h2").text(),//药品名称
                medicinalCompanyName=thisLi.find(".drugMessage .factory").text(),//生产厂家
                num=thisLi.find(".drugHandle .num_input").val(),//药品数量
                norms=thisLi.find(".specifcationsunit").val(),//规格
                unit=thisLi.find(".unit").val(),//药品单位
                smallUnit=thisLi.find(".smallUnit").val(),//药品小单位
                scaler=thisLi.find(".scaler").val();//换算量
            medicinalIdArr.push(medicinalId);//药品ID
            medicinalNameArr.push(medicinalName);//药品名称
            normsArr.push(norms);//规格
            medicinalCompanyNameArr.push(medicinalCompanyName);//生产厂家
            numArr.push(num);//药品数量
            unitArr.push(unit);//药品单位
            smallUnitArr.push(smallUnit);//药品小单位
            scalerArr.push(scaler);//换算量
        });
        console.log("normsArr:",normsArr)
        console.log("unitArr:",unitArr)
        console.log("smallUnitArr:",smallUnitArr)
        console.log("scalerArr:",scalerArr)
        var areaDom=$(".titleAdress .adressName"),
            provinceNamePreserve=areaDom.find(".proName").text(),
            cityNamePreserve=areaDom.find(".cityName").text(),
            areaNamePreserve=areaDom.find(".areaName").text(),
            provinceCodePreserve=areaDom.attr("data_codePro"),
            cityCodePreserve=areaDom.attr("data_codeCity"),
            areaCodePreserve=areaDom.attr("data_code"),
            consigneeName=$(".drugNameWrap .contFlex .name").text(),//收货人名称
            consigneePhone=$(".drugNameWrap .contFlex .numberMl").text(),//收货人电话
            consigneeAddress=$(".titleAdress .adressDetail").text();//收货人详细地址
        console.log("provinceNamePreserve:",provinceNamePreserve)
        console.log("cityCodePreserve:",cityCodePreserve)
        console.log("areaCodePreserve:",areaCodePreserve)
        
        //toastBox("urlbaocun:"+commonUrl + 'enquiryOrder/updateSaveEnquiryOrder'+",enquiryOrderIdNum:"+enquiryOrderIdNum);
        $.ajax({
            url: commonUrl+'enquiryOrder/updateSaveEnquiryOrder',
            type: 'post',
            async: false,
            data: {
                'clinicId': getlocalStorage.clinicIdVal,// 切记：改成变化id
                'enquiryOrderId':enquiryOrderIdNum?enquiryOrderIdNum:"",
                'clinicName': getlocalStorage.clinicNameVal,
                'medicinalTypeNum': $(".drugTotal1").text(),
                'totalNum': $(".drugTotal2").text(),
                'doctorId':getlocalStorage.doctorIdVal,
                'doctorName':getlocalStorage.doctorNameVal,
                'words': $(".leaveWord .leaveWordArea").val(),
                'medicinalId': medicinalIdArr.toString(),
                'medicinalName': medicinalNameArr.toString(),
                'norms': normsArr.toString(),
                'medicinalCompanyName': medicinalCompanyNameArr.toString(),
                'num': numArr.toString(),
                'unit': unitArr.toString(),
                'smallUnit': smallUnitArr.toString(),
                'scaler': scalerArr.toString(),
                'province': provinceNamePreserve,
                'city': cityNamePreserve,
                'area': areaNamePreserve,
                'provinceCode': provinceCodePreserve,
                'cityCode': cityCodePreserve,
                'areaCode': areaCodePreserve,
                consigneeName:consigneeName,//收货人名称
                consigneePhone:consigneePhone,//收货人电话
                consigneeAddress:consigneeAddress//收货人详细地址
            },
            success: function (datas) {
                var data = JSON.parse(datas);
                console.log("询价单修改保存data:", data);

                if (data.code == "0000") {
                    //判断点击的是否是弹窗内的保存按钮
                    if($(".delPop.backBox").css("display") == "block"){
                        $(".backBox").hide();
                    }
                    //判断点击的是不是分享
                    if(thisText=="发送报单询价"){
                        var enjoyenquiryOrderIdShare=data.data.enquiryOrderId;
                        window.location.href = "shoppingList.html?enjoyenquiryOrderIdShare="+enjoyenquiryOrderIdShare+"&identify=identify";
                    }else{
                         window.location.href="shoppingList.html";
                    }
                } else if (data.code == "0001") {
                    alert(data.msg);
                    //toastBox("data.msg"+data.msg)
                }
                medicinalIdArr=[];//药品ID
                medicinalNameArr=[];//药品名称
                normsArr=[];//规格
                medicinalCompanyNameArr=[];//生产厂家
                numArr=[];//药品数量
                unitArr=[];//药品单位
                smallUnitArr=[];//药品小单位
                scalerArr=[];//换算量
            },
            error: function () {
                alert("接口enquiryOrder/updateSaveEnquiryOrder请求失败！");
            }
        });
    });
    //预购药品返回
    $(".drugHead_arrowLeft").click(function () {
        $(".backBox").show();
    });
     $(".close").on("click",function(){
        
        $(".backBox").hide();
          //扫码枪input失去焦点，调用原生重新获取焦点
        //扫码枪调用IOS客户端代码
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
     })
    $(".backBox .delCancel").click(function () {
        //window.history.go(-1);
        window.location.href="shoppingList.html?enjoyenquiryOrderIdShare=''";
        $(".backBox").hide();
    });
    //预购药品：编辑信息
    $(".drugNameWrap,.titleAdress").click(function () {//之前的点击区域为editIconBtn
        $(".editPop").show();
        if($(".drugNameWrap .name").text()!="姓名" && $(".drugNameWrap .name").text()!=""){
            $(".ipt_person").val($(".drugNameWrap .name").text());
        }else{
            $(".ipt_person").val("");
        }
        if($(".drugNameWrap .numberMl").text()!="手机号码" && $(".drugNameWrap .numberMl").text()!=""){
            $(".ipt_phone").val($(".drugNameWrap .numberMl").text());
        }
        if($(".titleAdress .adressName").text()!="请填写收货地址" && $(".titleAdress .adressName").text()!=""){
            console.log($(".titleAdress .adressName").text())
            $(".ipt_area").val($(".titleAdress .adressName .proName").text()+$(".titleAdress .adressName .cityName").text()+$(".titleAdress .adressName .areaName").text());
            $(".ipt_address").val($(".titleAdress .adressDetail").text());
        }
    });
    /*询价单：预购药品：编辑信息*/
    $(".ipt_area").click(function(){// click ipt_area
        $(this).blur();
    })

    $(".edit_cancel").click(function(){// click edit_cancel
        $(".editPop").hide();
        //扫码枪input失去焦点，调用原生重新获取焦点
        //扫码枪调用IOS客户端代码
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
    })
    $(".edit_confirm").click(function(){// click edit_confirm
        var ipt_person = $(".ipt_person").val();
        var ipt_phone = $(".ipt_phone").val();
        var ipt_area = $(".ipt_area").val();
        var ipt_area1 = $(".ipt_area").attr("provinceName");
        var ipt_area2 = $(".ipt_area").attr("cityName");
        var ipt_area3 = $(".ipt_area").attr("areaName");
        var ipt_address = $(".ipt_address").val();
        var reg1 = /^[A-Za-z\u4e00-\u9fa5]{1,20}$/g;// 收货人：汉字、英文，限制输入最多20个字符
        var reg2 = /^1\d{10}$/;// 收货电话：以1开头的11位数字
        var reg3 = /^[\~|\`|\!|\(|\)|\-|\_|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\。|\，|\、|\；|\：|\？|\！|\—|\…|\·|\ˉ|\¨|\‘|\’|\“|\”|\～|\‖|\∶|\《|\》|\〈|\〉|\〖|\〗|\【|\】A-Za-z0-9\u4e00-\u9fa5]{1,50}$/g;// 详细地址：汉字、数字、标点符号、英文，最多50个字符
        if(ipt_person.replace(/\s/g,"")==""){
            toastBox("请输入收货人");
            $(".ipt_person").focus();
            return false;
        }else if(!reg1.test(ipt_person)){
            toastBox("收货人只能输入汉字、英文");
            $(".ipt_person").focus();
            return false;
        }
        if(ipt_phone.replace(/\s/g,"")==""){
            toastBox("请输入联系电话");
            $(".ipt_phone").focus();
            return false;
        }else if(!reg2.test(ipt_phone)){
            toastBox("请输入正确的联系电话");
            $(".ipt_phone").focus();
            return false;
        }
        if(ipt_area.replace(/\s/g,"")==""){
            toastBox("请选择所在地区");
            return false;
        }
        if(ipt_address.replace(/\s/g,"")==""){
            toastBox("请输入详细地址");
            $(".ipt_address").focus();
            return false;
        }else if(ipt_address.length>50){
            toastBox("详细地址不能超过50个字符");
            $(".ipt_address").focus();
            return false;
        }
        console.log("收货人::::::"+ipt_person);
        console.log("联系电话::::::"+ipt_phone);
        console.log("所在地区::::::"+ipt_area);
        console.log("详细地址::::::"+ipt_address);

        $.ajax({
            url:commonUrl+'enquiryOrder/saveClinicAddress',
            type:'post',
            async:false,
            data:{
                'clinicId':getlocalStorage.clinicIdVal,// 切记：改成变化id
                'consigneeName':ipt_person,
                'consigneePhone':ipt_phone,
                'province':$("#Addr").attr("provinceName")?$("#Addr").attr("provinceName"):$(".titleAdressText .adressName .proName").text(),
                'provinceCode':$("#Addr").attr("provinceCode")?$("#Addr").attr("provinceCode"):$(".titleAdressText .adressName").attr("data_codePro"),
                'city':$("#Addr").attr("cityName")?$("#Addr").attr("cityName"):$(".titleAdressText .adressName .cityName").text(),
                'cityCode':$("#Addr").attr("cityCode")?$("#Addr").attr("cityCode"):$(".titleAdressText .adressName").attr("data_codeCity"),
                'area':$("#Addr").attr("areaName")?$("#Addr").attr("areaName"):$(".titleAdressText .adressName .areaName").text(),
                'areaCode':$("#Addr").attr("areaCode")?$("#Addr").attr("areaCode"):$(".titleAdressText .adressName").attr("data_code"),
                'consigneeAddress':ipt_address
            },
            success:function(datas){
                var data = JSON.parse(datas);
                console.log("预购药品收货地址编辑保存页面data:",data);
                if(data.code=="0000"){
                    $(".adressNameDefault").hide();
                    $(".drugNameWrap .nameDefault").hide();
                    $(".drugNameWrap .name").text(ipt_person);
                    $(".drugNameWrap .numberMl").text(ipt_phone);
                    $(".titleAdress  .adressName .proName").text(ipt_area1);
                    $(".titleAdress  .adressName .cityName").text(ipt_area2);
                    $(".titleAdress  .adressName .areaName").text(ipt_area3);
                    $(".titleAdress  .adressDetail").text(ipt_address);
                    $(".titleAdress .adressName").attr({"provinceName":$("#Addr").attr("provinceName"),"cityName":$("#Addr").attr("cityName"),"areaName":$("#Addr").attr("areaName"),"data_codero":$("#Addr").attr("provinceCode"),"data_codeity":$("#Addr").attr("cityCode"),"data_code":$("#Addr").attr("areaCode")})
                    $(".editPop").hide();
                }else if(data.code=="0001"){
                    alert(data.msg);
                }
            },
            error:function(){
                alert("接口enquiryOrder/saveClinicAddress请求失败！");
            }
        });
        //扫码枪input失去焦点，调用原生重新获取焦点
        //扫码枪调用IOS客户端代码
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            window.webkit.messageHandlers.tapChangNums.postMessage("tapChangNums");
            //调用 安卓 方法
        } else if (/(Android)/i.test(navigator.userAgent)) {

            //pc
        } else {
        };
    })

    // 地址选择器遮罩层打开与关闭
    $(".editArea").click(function(e){
        $("#addressSelectWrapper").show();
        $(".editPop").css("background","rgba(0,0,0,0)");
        $(".editBox").css("opacity","0");
        e.stopPropagation();
    });
    $(document).click(function () {
        $("#addressSelectWrapper").hide();
        $(".editPop").css("background","rgba(0,0,0,0.5)");
        $(".editBox").css("opacity","1");
    });
    $("#cancel").click(function () {
        $("#addressSelectWrapper").hide();
        $(".editPop").css("background","rgba(0,0,0,0.5)");
        $(".editBox").css("opacity","1");
    });
    $("#addressSelect").click(function (e) {
        e.stopPropagation();
    });
    $(".addSel_cancel").click(function(){
        $("#addressSelectWrapper").hide();
        $(".editPop").css("background","rgba(0,0,0,0.5)");
        $(".editBox").css("opacity","1");
    })

    initAddress();

    //初始化地址选择
    console.log("jjj:",$(".titleAdress .adressName").attr("data_code"))
    function initAddress() {
        $(".ipt_area").cityLinkage({
            containerId: 'addressSelectWrapper',
            areaCode:$(".titleAdress .adressName").attr("data_code"),
            getSelectedCode:function(){
                var areaCode=$(".titleAdress .adressName").attr("data_code");

                if($("#Addr").attr("areaCode")){
                    return $("#Addr").data("code");
                }else{
                    return areaCode;
                }

                $(".editPop").css("background","rgba(0,0,0,0.5)");
                $(".editBox").css("opacity","1");
            },
            callback:function(data) {
                $(".ipt_area").val(data.addr).data("code",data.area.code);
                $(".editPop").css("background","rgba(0,0,0,0.5)");
                $(".editBox").css("opacity","1");
            }
        });
    }
    //drugPre_content高度，无数据时方便居中
    $(".drugPre_content").height($(window).height()-$(".drugPre_top").height()-44-60-70);
});
//function focusMethod(){
//    $(".searchInput").focus();
//    window.webkit.messageHandlers.inputFocus.postMessage("inputFocus");
//}
//window.onload=function(){
//    //扫码枪调用IOS客户端代码
//    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
//        focusMethod();
//        //调用 安卓 方法
//    } else if (/(Android)/i.test(navigator.userAgent)) {
//        //pc
//    } else {
//
////   window.history.go(-1)
//    };
//
//}
