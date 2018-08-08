//var enquiryIds=getUrlId();
var url=window.location.href;
var enquiryIds=getUrlValue(url, "id");
//返回按钮
$(".arrowLeft").on("click",function(){
	location.href='shoppingList.html';
})
function Ajax(){
    $.ajax({
//	 url:"http://192.168.31.43:8080/saveStorage/querySaveStorageInfo?enquiryId=40289fab6260d511016261ea99020019",
//        url:'https://test-mqps.zhiyiyunzhenshi.com/saveStorage/querySaveStorageInfo?enquiryId=ff80808162605e84016260d2e4c00045',
        url:commonUrl+"saveStorage/querySaveStorageInfo",
        type:"post",
        data:{
            "enquiryId": enquiryIds
//            "enquiryId":"40289f6c623c134101623c2c923d000e"
        },
        success:function(data){
            console.log(data);
            var date=JSON.parse(data);
            var datas =date .data;
            if(date.code==0000){
                var dateList=datas.dateList;
                var sellerhtml="",sellerhtmls="",NPhtml="",Selectedhtml="",Validityhtml="",standardhtml="",Packinghtml="",pricehtml="",freighthtml="",freighthtmls="",messagehtml="",messagehtmls="",AShtml="",minhtml="",bsList=""
                console.log(datas.busCount)
                $(".companyNum").text("（"+datas.busCount+"）")//商家数量
                $(".DrugsNum").text("（"+datas.enquiryCount+"）")//药品数量
                $.each(dateList,function(key,ele){
//                    判断规格是否为空
                   if(ele.norms==''){
                       var stage=ele.scaler+''+ele.smallUnit+'/'+ele.unit
                   }else{
                       var stage=ele.norms+'*'+ele.scaler+''+ele.smallUnit+'/'+ele.unit
                   }
                   var offerlength=ele.offerOrderDate.length
                    NPhtml+='<li>'+
                        '<p class="nomen_proprium">'+ele.medicinalName+'</p>'+
                        '<p class="Specifications">'+stage+'</p>'+
                        '<p class="companyname">'+ele.medicinalCompany+'</p>'+
                        '<p class="Quantity">采购数量：<span>'+ele.num+'</span>盒</p>'+
                        '</li>'
                    Selectedhtml+='<ul class="StorageRightdrug">'
                    $.each(ele.offerOrderDate,function(i,eles){
                        //效期
                        if(eles.validityTime==null || eles.validityTime==undefined){
                            Validityhtml=""
                        }else{
                            Validityhtml=eles.validityTime
                        }
                        //规格：
                        if(eles.norms==null || eles.validityTime==undefined){
                            standardhtml=""
                        }else{
                            standardhtml=eles.norms
                        }
                        //包装：
                        if(eles.norms==null || eles.validityTime==undefined){
                            Packinghtml=""
                        }else{
                            Packinghtml=eles.scaler+eles.smallUnit+"/"+eles.unit
                        }
                        //价格
                        if(eles.norms==null || eles.validityTime==undefined){
                            pricehtml=""
                        }else{
                            pricehtml=eles.price
                        }
                        //是否是最低价
                        if(eles.isLowest=="1"){
                            minhtml='<img class="minimum" src="../img/zuidi.png"/>'
                        }else{
                            minhtml=''
                        }
                        //是否报价

                        if(eles.isOffer=="1"){

                                Selectedhtml+='<li class="Offer" equiry-id="'+eles.equiryOrderDrugId+'" offerOrder-id="'+eles.offerOrderId+'" offerOrderDrug-id="'+eles.offerOrderDrugId+'">'+
                                    minhtml+
                                    '<p class="Validity"><span>效期：</span><span>'+Validityhtml+'</span></p>'+
                                    '<p class="standard"><span>规格：</span><span>'+standardhtml+'</span></p>'+
                                    '<p class="Packing"><span>包装：</span><span>'+Packinghtml+'</span></p>'+
                                    '<p class="monovalent"><span>'+pricehtml+'元</span>/'+eles.unit+'</p>'+
                                    '<img class="Selectedimg" src="../img/gouxuan.png"/>'+

                                    '</li>'


                        }else{
                            Selectedhtml+='<li class="Notquoted"><p>未报价</p></li>'
                            //eles.equiryOrderDrugId 寻价单药品id
                            //eles.offerOrderId 供货商id
                            //eles.offerOrderDrugId //供货商药品id

                        }

                    })
                    if(offerlength==1) {
                        Selectedhtml += '<li style="background:#fff"></li><li style="border-right:1px solid #b7b7b7;background:#fff"></li></ul>'
                    }else if(offerlength==2){
                        Selectedhtml += '<li style="border-right:1px solid #b7b7b7;background:#fff"></li></ul>'
                    }else{
                        Selectedhtml += '</ul>'
                    }

                })
                //运费

                    $.each(datas.freightList,function(k,fgt){
                        if(datas.freightList.length==1){
                            freighthtml+='<li><span>'+fgt+'</span>元</li>'
                            freighthtmls='<li></li><li style="border-right:1px solid #b7b7b7"></li>'
                        }else if(datas.freightList.length==2){
                            freighthtml+='<li><span>'+fgt+'</span>元</li>'
                            freighthtmls='<li style="border-right:1px solid #b7b7b7"></li>'
                        }else{
                            freighthtml+='<li><span>'+fgt+'</span>元</li>'
                            freighthtmls=''
                        }

                    })

                //留言

                    $.each(datas.leaveWordList,function(l,mgList){
                        if(datas.leaveWordList.length==1){
                            messagehtml+='<li><p>'+mgList+'</p></li>'
                            messagehtmls='<li></li><li style="border-right:1px solid #b7b7b7"></li>'
                        }else if(datas.leaveWordList.length==2){
                            messagehtml+='<li><p>'+mgList+'</p></li>'
                            messagehtmls='<li style="border-right:1px solid #b7b7b7"></li>'
                        }else{
                            messagehtml+='<li><p>'+mgList+'</p></li>'
                            messagehtmls=''
                        }

                    })


                //商家集合
                $.each(datas.busList,function(j,el){
                    if(datas.busList.length==2){
                        sellerhtml+='<li>'+
                            '<p class="COMPANY">'+el.busName+'</p>'+
                            '<p class="cognomen">'+el.userInfoRealName+'</p>'+
                            '<p class="Telephone">'+el.userInfoPhone+'</p>'+
                            '</li>'
                        sellerhtmls='<li style="border-right:1px solid #b7b7b7">'+
                            '<p class="COMPANY"></p>'+
                            '<p class="cognomen"></p>'+
                            '<p class="Telephone"></p>'+
                            '</li>'
                    }else if(datas.busList.length==1){
                        sellerhtml+='<li>'+
                            '<p class="COMPANY">'+el.busName+'</p>'+
                            '<p class="cognomen">'+el.userInfoRealName+'</p>'+
                            '<p class="Telephone">'+el.userInfoPhone+'</p>'+
                            '</li>'
                        sellerhtmls='<li>'+
                            '<p class="COMPANY"></p>'+
                            '<p class="cognomen"></p>'+
                            '<p class="Telephone"></p>'+
                            '</li>'+
                            '<li style="border-right:1px solid #b7b7b7">'+
                            '<p class="COMPANY"></p>'+
                            '<p class="cognomen"></p>'+
                            '<p class="Telephone"></p>'+
                            '</li>'
                    }else{
                        sellerhtml+='<li>'+
                            '<p class="COMPANY">'+el.busName+'</p>'+
                            '<p class="cognomen">'+el.userInfoRealName+'</p>'+
                            '<p class="Telephone">'+el.userInfoPhone+'</p>'+
                            '</li>'
                        sellerhtmls=""
                    }

                })
                $(".StorageRight").html(sellerhtml+sellerhtmls)
                $(".StorageNP").append(NPhtml)
                $(".freight").before(Selectedhtml)
                $(".freight").append(freighthtml+freighthtmls)
                $(".message").append(messagehtml+messagehtmls)
                //获取留言的高度
                var messageHeigth=$(".message").height()
                var messagetext=$(".message li p").text()
                var messagelength=messagetext.length
                console.log("aaaaaa:"+messagetext.length)
                console.log("aaaaaa:"+messageHeigth)
                if(messagelength>26){
                    console.log("111")
                    $(".message li,.message,.message_word").css({"height":75+messagelength+44+"px","padding-bottom":"20px"})
                    $(".message_word").css("line-height",75+messagelength+44+"px")
                }
                var liWidth=$(".StorageRight li").width()//li的宽度
                var liLength=$(".StorageRight li").length//li的长度
//                var lisLength=$(".StorageRightdrug").eq(0).find("li").length//li的长度
//    console.log("哈哈哈哈"+liLength)
                var Width=liWidth*liLength//计算ul的宽度
//                var Widths=liWidth*lisLength
                console.log(Width)
                //没有报价商家
                if(datas.busCount==0){
                    var height=$(".StorageLeftNP").height()
                    $(".StorageLeftNP").css({"position":"absolute","left":"0px","top":"111px"})
                    $(".default_page").css({"height":height+110+"px","margin-top":"60px"})
                    $(".freight,.message,.StorageRight,.Storagefooter p").css("display","none")
                    $(".default_page").css("display","block")
                    $(".StorageRight").css({"border":"0px","height":"0px"})
                    $(".StorageRightdrug").css("display","none")
                    if(height<620){
                        $(".default_main").css({"position":"absolute"})
                    }
                    if(height>620){
                        $(".default_main").css({"margin-top":"255px"})
                    }
                    var windowW=$(window).width()
                    if(windowW<=1024 && windowW>769){
                        $(".default_main").css({"margin-left":"55%"})
                    }
                    if(windowW<=768){
                        $(".default_main").css({"margin-left":"57%"})
                    }
                }else{
                    //判断少于7家商家
                    if(liLength<4){
                        $(".StorageRight,.StorageRightdrug,.freight,.message").css({"display":"-webkit-flex"})
                        $(".StorageRight li,.StorageRightdrug li,.freight li,.message li").css("-webkit-flex-grow","1")
                    }else{
                        $(".StorageRight").width(Width+liLength+1)//StorageRight的宽度
                        $(".StorageRightdrug,.freight,.message").width(Width+liLength+1)
                    }
                }

                StorageClick()
                scroll()
            }
            else if(date.code==0001){
                //toastBox(enquiryIds);
            }

        },
        error:function(){
            // alert("程序异常！")
            Toast();
            $(".StorageLeftNP").css("margin-top","90px")
            $(".freight,.message,.StorageRight").css("display","none")
        }
    })
}
Ajax();
var liLength
function scroll(){
    var windowW=$(window).width()
    var windowH=$(window).height()
    var StoraH=$(".StorageNP").height()
    var Freights=$(".Freights").height()
    var message_word=$(".message_word").height()
    var StoragrW=$(".StorageRight").width()
    var StoraHeight=StoraH+110+Freights+message_word+80
        liLength=$(".StorageRight li").length
    console.log("屏幕高"+windowH)
    console.log("屏幕宽"+windowW)
    console.log("ul高"+StoraHeight)
    console.log("ul宽"+StoragrW)

    if(windowW>=StoragrW && windowH>=StoraHeight){

        $("body").css("overflow","hidden")
        $("html").css("overflow","hidden")
        $("#Storages").css("overflow","hidden")
        $(".StorageLeft").css({"position":"relative","z-index":"99","top":"0px"})


    }else if(windowW<StoragrW || windowH<StoraHeight){
        //判断是否是左滑

        $("#Storages").scroll(function(){
            var top= $(this).scrollTop();
            var Left= $(this).scrollLeft();
            console.log("距左边距离："+Left)
            console.log("距上面边距离："+top)
            if(Left>0){
                console.log(1)
                $("body").css("overflow-y","hidden")
                $("body").css("overflow-x","scroll")
                $(".StorageLeftNP").css({"position":"fixed","left":"0"})
                $(".StorageRight").css({"position":"static"})
                $(".StorageLeft").css({"position":"fixed","top":"60px","z-index":"9999"})
                if(liLength<4){
                    $(".StorageRight").css("width",drugwidth+"px")
                }
            }
            if(top>0){

                $("body").css("overflow-x","hidden")
                $("body").css("overflow-y","scroll")
                $(".StorageRight").css({"position":"fixed","top":"0","left":-Left+"px"})
                $(".StorageNP").css({"position":"static"})
                var drugwidth=$(".StorageRightdrug").width()
                $(".StorageLeft").css({"position":"fixed","top":"60px","z-index":"9999"})
                if(liLength<4){
                    $(".StorageRight").css("width",drugwidth+"px")
                }
                // console.log(top)
            }
            if(Left<10 && top<10){
                $(".StorageRight").css({"position":"static"})
                $(".StorageNP").css({"position":"static"})
                $(".StorageLeftNP").css({"position":"absolute","left":"0px"})
//                $(".StorageLeft").css({"position":"static"})
            }
            if(Left==0){
                $(".StorageLeftNP").css({"position":"absolute","left":"0px"})
            }
            if(Left==0 && top==0){
                $(".StorageLeft").css({"position":"absolute","top":"0"})
//                $(".StorageNP").css({"margin-top":"111px"})
            }
            if(Left==0 && top<0){
                $(".StorageLeft").css({"position":"static"})
            }
            if(Left>0 && top>0){
                $(".StorageLeftNP").css({"position":"absolute","left":Left+"px"})
            }
        });
    }
}

var offerOrderIds=[];
//    点击每个商品，获取当前寻价单药品和供货商id
function StorageClick(){
    var codeId=new Array();
    var offerId=new Array();
    var equiry=[];
    var offerNumber='';
    var codeNumber='';
    var equiryNumber='';
    var new_equiry=[];
    var new_offerId=[];
    var Numbers="";
    $(".Offer").on("click",function(){
        var equiryId=$(this).attr("equiry-id") //寻价单药品id
        var offerOrderId=$(this).attr("offerOrder-id") //供货商id
        var offerorderdrug=$(this).attr("offerorderdrug-id") //供货商药品id
        var current_index=$(this).index();
          // console.log(equiryId)

        if($(this).hasClass("Selected")){

            Numbers--;//药品件数减少
            //取消被选择药品计算商家个数
            var Order=[];
//             Order=[]
            for(var i=0;i<offerId.length;i++){
                if(offerId[i]==offerOrderId){
                    Order.push(offerId[i])
                }
            }
            Order.pop(offerOrderId)
            offerId = $.grep(offerId, function(value) {
                return value != offerOrderId;
            });

            for(var t=0;t<Order.length;t++){
                offerId.push(Order[t])
            }
            new_offerId=[]


//            取消被选择药品删除数组对应元素
            codeId = $.grep(codeId, function(value) {
                return value != offerorderdrug;
            });


//            Numbers=codeId.length
//取消被选择药品计算药品种类
            var equirySelected=[]
            for(var i=0;i<equiry.length;i++){
                if(equiry[i]==equiryId){
                    equirySelected.push(equiry[i])
                }
            }
            equirySelected.pop(equiryId)
            equiry = $.grep(equiry, function(value) {
                return value != equiryId;
            });

            for(var t=0;t<equirySelected.length;t++){
                equiry.push(equirySelected[t])
            }
            new_equiry=[]
            $(this).addClass("Offer")
            $(this).find(".monovalent").find("span").removeClass("monovalentspan")
            $(this).removeClass("Selected")
            $(this).find(".Selectedimg").hide()
//            console.log("不选中"+Numbers)
        }else{
            Numbers++;//药品件数增加
            codeId.push(offerorderdrug);
            offerId.push(offerOrderId)
            equiry.push(equiryId)
            $(this).addClass("Selected")
            $(this).find(".monovalent").find("span").addClass("monovalentspan")
            $(this).removeClass("Offer")
            $(this).find(".Selectedimg").show();
            Numbers=codeId.length
//            console.log("选中"+Numbers)
            new_offerId=[];



        }
        //报价商去重
        for(var j=0;j<offerId.length;j++){
            var item=offerId[j]
            if($.inArray(item,new_offerId)==-1) {
                new_offerId.push(item);
            }
        }
        //药品种类去重
        for(var i=0;i<equiry.length;i++){
            var items=equiry[i]
            if($.inArray(items,new_equiry)==-1) {
                new_equiry.push(items);
            }
        }
        offerNumber=new_offerId.length;
        equiryNumber=new_equiry.length;

        $(".business").text(offerNumber)//共选几个商家
        $(".Several").text(equiryNumber)//药品种类
//        $(".Numbers").text(Numbers)//药品件数

        SelectedList()


//        console.log(codeNumber)
    })

}
// $(".Onekey").attr("disabled",true)
//判断是否有药品选中
function SelectedList(){
   var Selectedlength=$(".Selected").length;
//   console.log("选中的长度："+Selectedlength)
      // var aa=$(".Selected").attr("equiry-id")
   	  //  console.log(aa)
   if(Selectedlength>0){
          $(".Storagefooter button").attr("disabled",false)
   	     $(".Onekey").addClass("key")
   	     $(".Onekey").removeClass("Onekey")

         
   }else{
   	$(".Storagefooter button").attr('disabled',true)
   	 $(".key").addClass("Onekey")
   	 $(".key").removeClass("key")
   }

}
$(".Storagefooter button").attr('disabled',true)//一键采购按钮禁止点击
//点击一键采购按钮
$(".Storagefooter button").on("click",function(){
    offerOrderIds=[]
    //寻价单药品id
    for(var i=0;i<$(".Selected").length;i++){
        offerOrderIds.push($(".Selected").eq(i).attr("offerorderdrug-id"))
    }
//    console.log("数组："+offerOrderIds)
//    console.log($(".Selected").length)

	location.href='purchaseConfirmation.html?offerOrderIds='+offerOrderIds+'&enquiryId='+enquiryIds

})





