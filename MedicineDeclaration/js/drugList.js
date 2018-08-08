
    hasEnquiryOrder();//是否创建过询价单

    $(".tabRight").click(function(){
        location.href = 'purchaseList.html';
    })


    $(".drug_list").on("click",".del_btn",function(e){// 询价单-删除弹窗
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
                'clinicId':'000000005cef5f18015d061e29530111'// 切记：改成变化id
            },
            success:function(datas){
                var data = JSON.parse(datas);
                // var data = {"code":"0000","data":false,"msg":"成功"};
                // console.log(data);
                if(data.code=="0000"){
                    if(data.data==true){// 创建过->询价单列表
                        $(".shopListBody").show();
                    }else{// 未创建->询价功能介绍
                        window.location.href = 'enquiryFunIntroduction.html';
                    }
                }else if(data.code=="0001"){
                    alert(data.msg);
                }
            },
            error:function(){
              alert("接口enquiryOrder/findisCreateEnquiryOrder请求失败！");
            }
        })
    }

    function delEnquiryOrder(){// 删除询价单
        $.ajax({
            url:commonUrl+'enquiryOrder/delEnquiryInfo',
            type:'post',
            data:{
                'enquiryId':'40289f6c6229c2cd016229c2fb430010'// 切记：改成变化id
            },
            success:function(datas){
                var data = JSON.parse(datas);

                console.log(data);
                console.log(typeof data);
                if(data.code=="0000"){
                    alert(data.msg);
                    $(".delPop").hide();
                    // 刷新列表页

                }else if(data.code=="0001"){
                    alert(data.msg);
                }

            },
            error:function(){
              alert("接口enquiryOrder/delEnquiryInfo请求失败！");
            }
        })
    }


        $(".drug_list").on("click",".editAndDel",function(e){ //点击弹出编辑和删除按钮  注意： 动态添加的标签用事件委托
			$(this).parent(".list_header").siblings(".bubble-container").toggle().parent(".drug_order").siblings().find(".bubble-container").hide();
			e.stopPropagation();
        })
        $(".drug_list").on("click",".shareOrder",function(e){ //点击分享   注意： 动态添加的标签用事件委托
            $(".pop_up").show();
            $(".mask").show();
            $(".shopListBody").css("overflow","hidden");
            e.stopPropagation();
            codeList()
        })

        $(".drug_list").on("click",".unEdit",function(e){ //已分享  不可编辑
            //alert("不可编辑");
            $(".dialogue_alert").show();
            setTimeout(" $('.dialogue_alert').hide()",2000)  //toast提示2秒消失
            $(".dialogue_alert p").html("已分享的询价单不可编辑");
            e.stopPropagation();
        })
        $(".drug_list").on("click",".Edit",function(e){ //未分享   可编辑
            //alert("可编辑");
            window.location.href="inquiryCreate.html";
            e.stopPropagation();
        })
        $(".plus_icon").click(function(){   //点击加号同样跳转至   编辑页面
            window.location.href="inquiryCreate.html";
        })


    function closePop(){ //关闭弹窗
        $(".pop_up").hide();
        $(".mask").hide();
        $("#qrcode").empty();//每次关闭的时候清除一下生成的二维码
        $(".shopListBody").css("overflow","visible");
    }

    documents("bubble-container hide",".drug_list .bubble-container");


    function codeList(){  //采购清单二维码-------------胡君宝
        var codeUrl="";
        $.ajax({
            url: hjbUrl+"enquiryOrder/shareEnquiryOrderInfo",
            type:"post",
            dataType:"json",
            data:{
                enquiryOrderId: "40289f6c6229c2cd016229c2fb430000"
            },
            success:function(data){
                console.log(data);
                var drugList="";
                console.log("data",data.code);
                $(".clinicName").html(data.data.clinicName);//诊所名称
                $(".medicinalTypeNum").html(data.data.medicinalTypeNum);//药品种类
                var codeText=data.data.qrcode;

                var qrcode = new QRCode('qrcode', {  //生成二维码
                    text: codeText,
                    width: 111,
                    height: 111,
                    colorDark : '#000000',
                    colorLight : '#ffffff',
                    correctLevel : QRCode.CorrectLevel.H
                });
                //alert(data.data.goodsList.length)
                for(var i=0;i<data.data.goodsList.length;i++){
                    drugList+="<li>"+
                        "<h4>"+data.data.goodsList[i].medicinalName+"</h4>"+
                        "<p>"+ data.data.goodsList[i].norms+"/"+data.data.goodsList[i].unit+"</p>"+
                        "<P>"+data.data.goodsList[i].num+data.data.goodsList[i].unit+ "</P>"+
                        "<p>"+data.data.goodsList[i].medicinalCompanyName+ "</p>"+
                        "</li>"
                }
                $('.pop_content_list').append(drugList);
            },
            error:function() {
                alert('Ajax error!');
                // 即使加载出错，也得重置
                me.resetload();
            }
        });
    }

    //询价单和采购单的接口调取

    var page = 1;    //询价单中的初始页面值
    function content(){
        // 每页展示10个
        var size =10;
        var result = '';
        var edit='';
        var shareStatus=''; //是否分享的  状态
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: commonUrl+"enquiryOrder/queryEnquiryOrderList",
            //url: "../js/demo.json",
            data:{
                clinicId: "000000005cef5f18015d061e29530111",
                page: page,
                limit: size
            },
            success: function(data){
                console.log("-------------------------",data);
                console.log(data);
                if(data.data.length>0){
                    console.log("data的长度",data.data.length);
                    for(var j=0;j<data.data.length;j++){
                        console.log(j);
                        if(data.data[j].isShare==0){  // 0 未分享  ，1已分享
                            edit='<div class="editor_btn unEdit">编辑</div>';
                        }
                        else{
                            edit='<div class="editor_btn Edit">编辑</div>';
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

                        result+='<li class="drug_order" data-enquiryId="'+data.data.enquiryId+'">'+
                            '<div class="list_header">'+
                            '<p>发布时间：'+data.data[j].createdTime+'</span></p>'+
                            '<img src="../img/more.png" class="editAndDel"/>'+
                            '<img src="../img/share.png"  class="shareOrder"/>'+
                            '<h3><i>'+data.data[j].offerCount+'</i>种药品已报价</h3>'+
                            '<h4>共'+data.data[j].enquiryCount+'种药品</h4>'+
                            '</div>'+
                            '<div class="list_footer">'+
                            imgArr+
                            '<p> <i>'+data.data[j].busCount+'</i>家商业公司</p>'+
                            '</div>'+
                            '<div class="bubble-container hide">'+
                            '<div class="triangle"></div>'+
                            edit+
                            '<div class="del_btn">删除</div>'+
                            '</div>'+
                            '</li>';
                    }
                    $(".drug_list").append(result);
                }
            }
        });
    }		// 如果没有数据
    content();
    //    判断页面滑到最底部
    window.onscroll = function(){
        var t = document.documentElement.scrollTop || document.body.scrollTop;  //离上方的距离
        var h =window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //可见宽度
        if( t >= document.documentElement.scrollHeight -h ) {
            var ss=page++;
            console.log(ss)
        }
    }
    //点击 进入询价单详情
    $(".drug_list").on("click",".drug_order",function(){
        var enquiryId = $(this).data("enquiryId");
        console.log(enquiryId);
        location.href = 'Storage.html?id='+enquiryId;
    })







