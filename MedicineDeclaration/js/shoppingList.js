
/*var wH = document.documentElement.clientHeight;
$(".drug_list").height(wH-60);
$(".default_page").height(wH-60);
$(window).resize(function() {
    $(".drug_list").height(wH-60);
    $(".default_page").height(wH-60);
});*/

   var url=window.location.href;  //获取原生传过来的诊所id
   // var url="http://192.168.29.186/MedicineDeclaration/html/shoppingList.html?clinicId=110288f4a5160a0520151656ed0panda&clinicName=修改开发研发中心测试诊所3&clinicEmployId=30288f4a5160a0520151656ed0panda1&realName=李涛2号";  //获取原生传过来的诊所id
/*http://192.168.31.121/MedicineDeclaration/html/enquiryFunIntroduction.html*/
/*110288f4a5160a0520151656ed0panda 30288f4a5160a0520151656ed0panda1 修改开发研发中心测试诊所3 李涛2号*/
url=decodeURIComponent(url);
if(getUrlValue(url, "clinicId")){
    var clinicIdNumber=getUrlValue(url, "clinicId");
    var clinicNameValNumber=getUrlValue(url, "clinicName");
    var clinicEmployIdNumber=getUrlValue(url, "clinicEmployId");
    var realNameNumber=getUrlValue(url, "realName");
    /*shoppingList.html?clinicId=ff80808160597f8a01606ccf0db90309&clinicName=pc占用&clinicEmployId=ff80808160597f8a01606cd091130485&realName=PC帐号1*/
    //toastBox(clinicIdNumber);
    localStorage.setItem("clinicIdStorage",clinicIdNumber);   //存下clinicId
    localStorage.setItem("clinicNameStorage",clinicNameValNumber);   //存下clinicName
    localStorage.setItem("clinicEmployIdStorage",clinicEmployIdNumber);   //存下clinicEmployId
    localStorage.setItem("realNameStorage",realNameNumber);   //存下realName
}
var getlocalStorage={//取值
    "clinicIdVal":localStorage.getItem("clinicIdStorage"),
    "clinicNameVal":localStorage.getItem("clinicNameStorage"),
    "doctorIdVal":localStorage.getItem("clinicEmployIdStorage"),
    "doctorNameVal":localStorage.getItem("realNameStorage")
}
//toastBox("诊所id："+localStorage.getItem("clinicIdStorage")+"，clinicId:"+getlocalStorage.clinicIdVal+"，doctorId:"+getlocalStorage.doctorIdVal)

/*if(getUrlValue(url, "enjoyenquiryOrderIdShare")){//点击创建询价单中的分享按钮
    $(".pop_up").show();
    $(".shopListBody").css("overflow","hidden");
    codeList(getUrlValue(url, "enjoyenquiryOrderIdShare"));
    //toastBox('getUrlValue(url, "enjoyenquiryOrderIdShare")');
}*/
hasEnquiryOrder();//是否创建过询价单

$(".tabRight").click(function(){
    location.href = 'purchaseList.html';
})

var enquiryIdVal="";
$(".drug_list").on("click",".del_btn",function(e){// 询价单-删除弹窗
    enquiryIdVal= $(this).parents(".drug_order").attr("data-enquiryId");
    var ele = e || window.event;
    if(ele.stopPropagation){
        ele.stopPropagation();
    }else{
        ele.cancelBubble=true;
    }
    $(".delPop").show();
    $(".shopListBody").css("overflow","hidden");
    $(".bubble-container").hide();
})
$(".delConfirm").click(function(){
    delEnquiryOrder();

    $(".shopListBody").css("overflow","visible");
})
$(".delCancel").click(function(){
    $(".delPop").hide();
    $(".shopListBody").css("overflow","visible");
})


function hasEnquiryOrder(){// 是否创建过询价单
    $.ajax({
        url:commonUrl+'enquiryOrder/findisCreateEnquiryOrder',
        type:'post',
        async:false,
        data:{
            'clinicId':getlocalStorage.clinicIdVal// 切记：改成变化id
        },
        success:function(datas){
            var data = JSON.parse(datas);
            // var data = {"code":"0000","data":false,"msg":"成功"};
            console.log("是否创建过询价单data:",data);
            if(data.code=="0000"){
                if(data.data==true){// 创建过->询价单列表
                    $(".shopListBody").show();
                }else{// 未创建->询价功能介绍
                    window.location.href = 'enquiryFunIntroduction.html';
                }
            }else if(data.code=="0001"){
                toastBox(data.msg)
            }
        },
        error:function(){
            //alert("接口enquiryOrder/findisCreateEnquiryOrder请求失败！");
            toastBox("请求失败")
        }
    })
}

function delEnquiryOrder(){// 删除询价单
    $.ajax({
        url:commonUrl+'enquiryOrder/delEnquiryInfo',
        type:'post',
        data:{
            'enquiryId':enquiryIdVal// 切记：改成变化id
        },
        success:function(datas){
            var data = JSON.parse(datas);

            console.log(data);
            console.log(typeof data);
            if(data.code=="0000"){
                //alert(data.msg);
                $(".delPop").hide();
                // 刷新列表页
                window.location.href="shoppingList.html";
            }else if(data.code=="0001"){
                toastBox(data.msg)
            }

        },
        error:function(){
            toastBox("请求失败")
        }
    })
}

$(".drug_list").on("click",".newClick",function(){   //点击加号同样跳转至   编辑页面
        window.location.href="inquiryCreate.html";
})
$(".drug_list").on("click",".morestill",function(e){ //点击弹出编辑和删除按钮  注意： 动态添加的标签用事件委托
    $(this).parent(".list_header").siblings(".bubble-container").toggle().parent(".drug_order").siblings().find(".bubble-container").hide();
    e.stopPropagation();
})
$(".drug_list").on("click",".goshares",function(e){ //点击分享   注意： 动态添加的标签用事件委托;
    enquiryIdVal= $(this).parents(".drug_order").attr("data-enquiryId");
    $(".pop_up").show();
    $(".shopListBody").css("overflow","hidden");
    e.stopPropagation();
    console.log("分享："+enquiryIdVal)
    // alert("分享："+enquiryIdVal)
    // debugger;
    codeList(enquiryIdVal)
})

$(".drug_list").on("click",".unEdit",function(e){ //已分享  不可编辑
    toastBox("已分享的询价单不可编辑");
    e.stopPropagation();
})
$(".drug_list").on("click",".Edit",function(e){ //未分享   可编辑
    enquiryIdVal=$(this).parents(".drug_order").attr("data-enquiryId");
    $(".bubble-container").hide();
    window.location.href="inquiryCreate.html?enquiryIdEdit="+enquiryIdVal;
    e.stopPropagation();
})


function closePop(){ //关闭弹窗
    $(".pop_up").hide();
    $("#qrcode").html("");//每次关闭的时候清除一下生成的二维码
    $(".shopListBody").css("overflow","visible");
    $(".pop_content_list").html(""); //关闭的时候清除下列表数据
}

documents("bubble-container hide",".drug_list .bubble-container");

//分享按钮数据展示
function codeList(eqOrderVarId){  //采购清单二维码-------------胡君宝
    var codeUrl="";
    var drugList="";
    $.ajax({
        url: commonUrl+"enquiryOrder/shareEnquiryOrderInfo",
        type:"post",
        dataType:"json",
        async:false,
        data:{
            enquiryOrderId: eqOrderVarId
        },
        success:function(data){
            console.log(typeof (data))
            $(".clinicName").html(data.data.clinicName);//诊所名称
            // $(".medicinalTypeNum").html(data.data.medicinalTypeNum);//药品种类
            var codeText=data.data.qrcode;
            var qrcode = new QRCode('qrcode', {  //生成二维码
                text: codeText,
                width: 150,
                height: 150,
                colorDark : '#000000',
                colorLight : '#ffffff',
                correctLevel : QRCode.CorrectLevel.H
            });
           
            drugList='<h3>采购清单（共<i class="medicinalTypeNum">'+data.data.medicinalTypeNum+'</i>种药品）</h3>'   
            for(var i=0;i<data.data.goodsList.length;i++){
                drugList+="<li>"+
                    "<h4>"+data.data.goodsList[i].medicinalName+"</h4>"+
                    "<p>"+ data.data.goodsList[i].norms+"*"+data.data.goodsList[i].scaler+data.data.goodsList[i].smallUnit+"/"+data.data.goodsList[i].unit+"</p>"+
                    "<P>"+data.data.goodsList[i].num+data.data.goodsList[i].unit+ "</P>"+
                    "<p>"+data.data.goodsList[i].medicinalCompanyName+ "</p>"+
                    "</li>"
            }
            $('.pop_content_list').append(drugList);
        },
        error:function() {
            toastBox("请求失败");
        }
    });
}


if(getUrlValue(url, "identify")=="identify"){//点击创建询价单中的分享按钮
    //console.log('getUrlValue(url, "enjoyenquiryOrderIdShare"):',getUrlValue(url, "enjoyenquiryOrderIdShare"))
    $(".pop_up").show();
    $(".shopListBody").css("overflow","hidden");
    var enjoyenquiryOrderIdShare=getUrlValue(url, "enjoyenquiryOrderIdShare");
    codeList(enjoyenquiryOrderIdShare);
}


    //下拉刷新的相关高度函数
    function getScrollTop() {
        var scrollTop = 0;
        if(document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if(document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    //获取当前可视范围的高度
    function getClientHeight() {
        var clientHeight = 0;
        if(document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
        } else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
        }
        return clientHeight;
    }

    //获取文档完整的高度
    function getScrollHeight() {
        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

//询价单和采购单的接口调取
    //window.onscroll = function() {
    //    if(getScrollTop() + getClientHeight() == getScrollHeight()) {
    //        page++;
    //        content()
    //    }
    //}
//点击 进入询价单详情
$(".drug_list").on("click",".drug_order",function(){
    var enquiryId = $(this).attr("data-enquiryId");
    console.log(enquiryId);
    location.href = 'Storage.html?id='+enquiryId;
});
//返回
$(".arrowLeft").click(function(){
    goBack();
});
//新建询价单
var Newlybuild='<li class="newClick"><p><img src="../img/Bitmap.png" /><span>添加询价单</span></p></li>'   
$(".drug_list").append(Newlybuild);   

//上拉加载，下拉刷新

$(function(){
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,重置列表数据;
    var mescroll = new MeScroll("mescroll", {
        up: {
            loadFull: {
                use: false, //列表数据过少,是否自动加载下一页,直到满屏或者无更多数据为止;默认false
                delay: 500 //延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载中区域动画已执行完毕;
            },
            page: {
                num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                size: 10//每页数据的数量
            },
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            clearEmptyId: "dataList" //1.下拉刷新时会自动先清空此列表,再加入数据; 2.无任何数据时会在此列表自动提示空
           /* toTop:{ //配置回到顶部按钮
                src : "../res/img/mescroll-totop.png" //默认滚动到1000px显示,可配置offset修改
                //offset : 1000
            }*/
        }
    });

    /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function getListData(page){
        //联网加载数据
        getListDataFromNet(page.num, page.size, function(data){
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            console.log("page.num="+page.num+", page.size="+page.size+", data.length="+data.data.length);

            //方法一(推荐): 后台接口有返回列表的总页数 totalPage
            //mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

            //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
            //mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

            //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
            //mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

            //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
            mescroll.endSuccess(data.data.length);

            //设置列表数据,因为配置了emptyClearId,第一页会清空dataList的数据,所以setListData应该写在最后;
            setListData(data);
        }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
        });
    }


    function setListData(data,pageNum){
        var edit='';
        var result = '';
        console.log(data.data.length)
        if(data.code==0000){
            if(pageNum==1 && data.data.length==0){
                $(".default_page").show();
                $(".shopListBody").css("overflow","hidden");
            }else{
                // result='<li class="newClick">li</li>'
                for(var j=0;j<data.data.length;j++){
                    //console.log(j);
                    if(data.data[j].isShare==0){  // 0 未分享  ，1已分享
                        edit='<div class="editor_btn  Edit">编辑</div>';
                    }
                    else{
                        edit='<div class="editor_btn unEdit">编辑</div>';
                    }

                    if(data.data[j].imgs.length<5) { //微信头像不大于5个的时候
                        var imgArr='';  //存放每个卡片中的图片
                        for (var k = 0; k < data.data[j].imgs.length; k++) {
                            imgArr += '<img src="' + data.data[j].imgs[k] + '"/>';
                        }

                    }
                    else if(data.data[j].imgs.length>=5){
                        var imgArr='';  //存放每个卡片中的图片
                        for (var k = 0; k <5; k++) {
                            //imgArr += '<img src="' + data.data[j].imgs[k] + '"/>';
                            imgArr+='<img src="'+data.data[j].imgs[k]+'"/>'
                        }
                        imgArr+='<img src="../img/more.png" style="width: 17px;height: 4px;position: absolute;top: 14px;margin-left: 10px;"/>'
                    }

                    result+='<li class="drug_order" data-enquiryId="'+data.data[j].enquiryId+'">'+
                        '<div class="list_header">'+
                        '<p>发布时间：'+data.data[j].createdTime+'</span></p>'+
                        '<img src="../img/more.png" class="editAndDel morestill"/><span class="more morestill">更多</span>'+
                        '<img src="../img/share.png"  class="shareOrder goshares"/><span class="share goshares">分享</span>'+
                        '<h3><i>'+data.data[j].offerCount+'</i>种药品已报价</h3>'+
                        '<h4>共'+data.data[j].enquiryCount+'种药品</h4>'+
                        '</div>'+
                        '<div class="list_footer">'+
                        '<span>'+imgArr+'</span>'+
                        '<p> <i>'+data.data[j].busCount+'</i>家商业公司</p>'+
                        '</div>'+
                        '<div class="bubble-container hide">'+
                        '<div class="triangle"></div>'+
                        edit+
                        '<div class="del_btn">删除</div>'+
                        '</div>'+
                        '</li>';
//                        console.log(result)
                }
                $(".drug_list").append(result);
                if(data.data.length==0){
                    if($(".drug_list li").hasClass("newClick")==false){
                    var Newlybuild='<li class="newClick"><p><img src="../img/Bitmap.png" /><span>添加询价单</span></p></li>'
                    $(".mescroll-empty").before(Newlybuild);
                    $(".mescroll-empty").css("clear","both")
                   }
                }else{
                    //判断是否含有newClick
                    if($(".drug_list li").hasClass("newClick")==false){
                        var Newlybuild='<li class="newClick"><p><img src="../img/Bitmap.png" /><span>添加询价单</span></p></li>'
                        $(".drug_order").eq(0).before(Newlybuild);
                    }
                }
                
            }

        }else if(data.code=="0001"){
            //alert(data.msg);
            toastBox(data.msg+"或者没有更多数据")
        }
    }


    /*联网加载列表数据
     在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
     请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
     实际项目以您服务器接口返回的数据为准,无需本地处理分页.
     * */
    function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        console.log(75)
        //延时一秒,模拟联网
        setTimeout(function () {
            $.ajax({
                type: 'post',
                url: commonUrl+"enquiryOrder/queryEnquiryOrderList?clinicId="+getlocalStorage.clinicIdVal+"&page="+pageNum+"&limit="+pageSize,
//		                url: '../res/pdlist1.json?num='+pageNum+"&size="+pageSize,
                dataType: 'json',
                success: function(data){
                    successCallback(data);
                },
                error: errorCallback
            });
        },500)
    }

});

//红包入口
// $.ajax({
//     url:commonUrl+'redPacketInfo/isShowActivePage?clinicId='+getlocalStorage.clinicIdVal,
//     type:'post',
//     async: false,
//     success:function(datas){
//        var data=eval("("+datas+")")
//        var activePageUrl=data.activePageUrl;
//        if(data.resultCode=="0000"){
//           $(".redpacket").show()
         
//            $(".redpacket").on("click",function(){ 
           
//              if(data.listCode=="1001"){
//                 window.location.href='../html/Redenvelopes.html?clinicId='+getlocalStorage.clinicIdVal;
//             }else if(data.listCode=="1002"){
//                  window.location.href=activePageUrl;
//              }
//           })
            
//        }else if(data.resultCode=="0001"){
//            $(".redpacket").hide()
//        }
//     },
//     error:function(){
//         toastBox("请求失败！");
//     }
// })
