var wH = document.documentElement.clientHeight;
$(".purchase_list").height(wH-120);
$(".default_page").height(wH-120);
$(window).resize(function() {
    $(".purchase_list").height(wH-120);
    $(".default_page").height(wH-120);
});


var getlocalStorage={//取值
    "clinicIdVal":localStorage.getItem("clinicIdStorage"),
    "clinicNameVal":localStorage.getItem("clinicNameStorage"),
    "doctorIdVal":localStorage.getItem("clinicEmployIdStorage"),
    "doctorNameVal":localStorage.getItem("realNameStorage")
}
$(".newClick").click(function(){   //点击加号同样跳转至   编辑页面
    window.location.href="inquiryCreate.html";
})

$(".medList").click(function(){
    location.href = 'shoppingList.html';
})
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




//toastBox("agj"+getlocalStorage.clinicIdVal);
var purchase=1;  //采购单初始值
//v0.2增加根据待发货、待收货、已收货查询采购单
var purchase_status=0;
//点击立即入库带过来状态参数
var url=window.location.href;
purchase_status=getUrlValue(url, "status");
purchaseList();// 采购单列表页---切记：需要传clinicId，page
$(".purchase_caption li").each(function(){
    if($(this).attr("date-status")==purchase_status){
        $(".purchase_caption li span").removeClass("purchase_current");
        $(this).find("span").addClass("purchase_current");
    };
})
$(".purchase_caption li").on("click",function(){
    purchase_status=$(this).attr("date-status");
    $(".purchase_caption li span").removeClass("purchase_current");
    $(this).find("span").addClass("purchase_current");
    $(".purchase_list").find(".purchase_item").remove();
    purchase=1;
    purchaseList();

})

$(".purchase_list")[0].onscroll = function() {  //上拉刷新数据
    console.log("scrollTop:::::::" + $(this)[0].scrollTop);
    console.log("clientHeight:::::::" + $(this)[0].clientHeight);
    console.log("scrollHeight:::::::" + $(this)[0].scrollHeight);
    var scrollTop = $(this)[0].scrollTop;
    var clientHeight = $(this)[0].clientHeight;
    var scrollHeight = $(this)[0].scrollHeight;
    if (scrollHeight-scrollTop -clientHeight <2) {  //一体机就差这 2px   注意：好奇葩
        purchase++;
        //alert(page);
        purchaseList();
    }
}

console.log(purchase)
// 点击进入采购单详情
$(".purchase_list").on("click",".purchase_item",function(){
    var orderId = $(this).data("orderid");
    purchase_status=$(this).attr("data-status");
    console.log(orderId);
    location.href = 'particulars.html?id='+orderId+"&&status="+purchase_status;
})


function purchaseList(){// limit-分页数；page-当前页
    $.ajax({
        url:commonUrl+'enquiryOrder/queryOrderList',
        type:'post',
        data:{
            'clinicId':getlocalStorage.clinicIdVal ,
//            'clinicId':"ff8080816222652c0162254435c50305" ,
            'limit':10,
            'page':purchase,
            'status':purchase_status
        },
        success:function(datas){
            console.log(datas)
            console.log(purchase_status)
            var data = JSON.parse(datas);
            if(data.code=="0000"){
                var dataList = data.data;
                if( purchase==1 && dataList.length==0){
                    $(".default_page").show();
                    $(".shopListBody").css("overflow","hidden");
                }
                else{
                    $(".default_page").hide();
                    var purchaseList = '', status = '';
                    $.each(dataList,function(idx,obj){
                        if(obj.status==0){
                            status = '待发货';
                            var drug_title='<span class="purchase_item_num">'+obj.medicinalTypeNum+'</span>种药品'+status
                        }else if(obj.status==1){
                            status = '待收货';
                            var drug_title='<span class="purchase_item_num">'+obj.medicinalTypeNum+'</span>种药品'+status
                        }else if(obj.status==2){
                            status = '已收货';
                           if(obj.isSaveNoCount=="0"){
                               var drug_title=obj.isSaveRemark
                           }else{
                               var drug_title='<span class="purchase_item_num">'+obj.isSaveNoCount+'</span>'+obj.isSaveRemark
                           }

                        }else if(obj.status==3){
                            status = '交易关闭';
                            var drug_title="货到付款已取消"
                        }else if(obj.status==4){
                            status = '交易关闭';
                            var drug_title="线上支付已退款"
                        }else if(obj.status==5){
                            status = '待支付';
                            var drug_title='<span class="purchase_item_num">'+obj.medicinalTypeNum+'</span>种药品'+status
                        }
                        purchaseList += '<ul class="purchase_item" data-orderid="'+obj.orderBusinessId+'" data-status="'+obj.status+'">'+
                            '<li class="purchase_item_tit">'+
                            '<span class="purchase_item_time left">采购时间：'+obj.dateCreated+'</span>'+
                            '<span class="purchase_item_status right">'+status+'</span>'+
                            '</li>'+
                            '<li class="purchase_item_main">'+
                            drug_title+
                            '</li>'+
                            '<li class="purchase_item_foot">'+
                            '<span class="purchase_item_imgs left">'+
                            '<img src="'+obj.portraitImg+'" alt=""/>'+
                            '</span>'+
                            '<span class="purchase_item_company right">'+obj.companyName+'</span>'+
                            '</li>'+
                            '</ul>';
                    })
                    $(".purchase_list").append(purchaseList);
                }
            }else if(data.code=="0001"){
                toastBox(data.msg);
            }
        },
        error:function(){
            toastBox("请求失败！");
        }
    })
}

    //返回
$(".arrowLeft").click(function(){
    goBack();
});

//红包入口
// $.ajax({
//     url:commonUrl+'redPacketInfo/isShowActivePage?clinicId='+getlocalStorage.clinicIdVal,
//     type:'post',
//     success:function(datas){
//        var data=eval("("+datas+")");
//        var activePageUrl=data.activePageUrl;
//        if(data.resultCode=="0000"){
//           $(".redpacket").show()
//           $(".redpacket").on("click",function(){          
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








