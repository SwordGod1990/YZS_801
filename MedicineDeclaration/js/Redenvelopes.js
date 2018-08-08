
//立即领取红包
$(".btn button").on("click",function(){
	 $(".QRcode").show()
})
$(".close").on("click",function(){
	 $(".QRcode").hide()
})
var height=$(".accumulative tbody").height()
if(height>300){
	$(".accumulative tbody").css({"height":"304px"})
}

//活动说明
$(".Explain").on("click",function(){
	window.location.href='../html/redpacket.html'
})
//诊所ID
var url=window.location.href;
 clinicId=getUrlValue(url, "clinicId");
 //上拉加载，下拉刷新
var totalPage="",pages=1,size=10;
//初始化加载
ajax()
function ajax(){
    $.ajax({
        url:commonUrl+'redPacketInfo/redPacketInfoList?page=1&pageSize=10&clinicId='+clinicId,
        type: 'post',
        async: false,
        dataType: 'json',
        success: function(data){
            if(data.resultCode=="0000"){
                fenye()
            }else if(data.resultCode=="0001"){
                $(".End").show()
                $(".main").hide()
                $(".btn").hide()
                $(".Redenvelopes_bigheader").hide()
                $(".Redenvelopes_header").show()
                         
                       
            }
        },
        error:function(){
            toastBox("请求失败！");
        }
    });
}

function fenye(){
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,重置列表数据;
    var mescroll = new MeScroll("mescroll", {
        up: {
            loadFull: {
                use: false, //列表数据过少,是否自动加载下一页,直到满屏或者无更多数据为止;默认false
                delay: 500 //延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载区域动画已执行完毕;
            },
            page: {
                num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                size: 10//每页数据的数量
            },
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10clearEmptyId: "dataList" //1.下拉刷新时会自动先清空此列表,再加入数据; 2.无任何数据时会在此列表自动提示空
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
            console.log(data)
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
             console.log("page.num="+page.num+", page.size="+page.size+", data.length="+data.content.length);

            //方法一(推荐): 后台接口有返回列表的总页数 totalPage
            //mescroll.endByPage(data.content.length, totalPage); //必传参数(当前页的数据个数, 总页数)

            //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
            //mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

            //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
            //mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

            //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
             mescroll.endSuccess(data.content.length);

            //设置列表数据,因为配置了emptyClearId,第一页会清空dataList的数据,所以setListData应该写在最后;
            setListData(data);
        }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
        });
    }


    function setListData(data,pageNum){
        var content=data.content;
        console.log(data)
        // var length=content.length;
        var html="",sendtype="",orderTime="";
        if(data.resultCode=="0000"){
             var startime=data.activeStartTime.split("-"),
                 endtime=data.activeEndTime.split("-");
                console.log(startime[1])
                // console.log("时间："+data.orderTime)
                 //活动时间
                 if(data.activeStatus==1){
                     $(".finished").text(startime[1]+"-"+startime[2]+"至"+endtime[1]+"-"+endtime[2])
                     $(".finished").css("color","#666666")
                 }else if(data.activeStatus==2){
                    $(".finished").text("已结束")
                    
                 }
                
                 //待领取红包金额
                 $(".prompt-text").text(data.unclaimedMoney)
                 //已领取红包金额
                 $(".receive span").eq(1).text(data.claimedMoney)
                 
                  $.each(content,function(key,ele){

                        if(ele.sendType==0){
                            var starTime=ele.startTime.split("-"),
                                endTime=ele.endTime.split("-"),
                                

                            sendtype='<div class="bottom">'+
                                          '<p><span>订单累计金额：</span><span>¥'+ele.orderTotalPrice+'</span></p>'+
                                          '<p><span></span><span></span><i data-ID="'+ele.redPacketInfoId+'">详情</i><img src="../img/Bitmap@2x.png"></p>'+
                                      '</div>'
                            orderTime='<p class="record-time"><span>'+starTime[1]+'-'+starTime[2]+'至'+endTime[1]+'-'+endTime[2]+'</span></p>'
                        }else if(ele.sendType==1){
                            sendtype='<div class="bottom">'+
                                         '<p><span>订单编号：</span><span>'+ele.orderNum+'</span></p>'+
                                         '<p><span>订单金额：</span><span>¥'+ele.orderTotalPrice+'</span></p>'+
                                    '</div>'
                            orderTime='<p class="record-time"><span>'+ele.orderTime+'</span></p>'
                        }
                        html+='<li>'+
                                orderTime+
                                '<p class="record-money">¥'+ele.sendMoney+'</p>'+
                                '<p class="redpacket">获取红包(元)</p>'+
                                  sendtype+
                              '</li>'
                                    
                   })
                       $(".record-main").html(html)
                       //累计订单详情
                       $(".bottom i,.bottom img").parents("li").on("click",function(){
                             $(".accumulative").show()
                             var redPacketInfoId=$(this).find("i").attr("data-ID");
                             var Toptime=$(this).find(".record-time").text()
                             console.log(redPacketInfoId)
                             details(redPacketInfoId)
                             console.log("总页数："+totalPage)

                             $(".accumulativeheader span").eq(0).text(Toptime+"获的红包订单")
                            //  //分页
                            // $(".page_current").createPage({
                            //         pageCount:totalPage, //总页数
                            //         current: 1, //当前页
                            //         display: 1,//跳转功能1为显示，0为隐藏
                            //         backFn: function (p) {// p为点击的当前页码
                            //             pages = p;
                            //             details(redPacketInfoId)
                            //         }
                            // });
                                    
                                
                       })
                       
                        
        }else if(data.resultCode=="0001"){
            $(".End").show()
            $(".main").hide()
            $(".btn").hide()
            $(".Redenvelopes_bigheader").hide()
            $(".Redenvelopes_header").show()
            // window.location.href='../html/redpacket.html'

        }
    }


    /*联网加载列表数据
     在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
     请忽略getListDataFromNet的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
     实际项目以您服务器接口返回的数据为准,无需本地处理分页.
     * */

    function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        
        //延时一秒,模拟联网
        setTimeout(function () {//8a990d915e8121aa015e9e1e5b2454ec
            $.ajax({
                url:commonUrl+'redPacketInfo/redPacketInfoList?page='+pageNum+'&pageSize='+pageSize+'&clinicId='+clinicId,
                type: 'post',
                async: false,
                dataType: 'json',
                success: function(data){
                   // console.log(data)
                    successCallback(data);
                },
                error: errorCallback
            });
        },500)
    }

}
//详情分页
 details()
 console.log($(window).height())
function details(redPacketInfoId){
    
   var mescroll = new MeScroll("mescrolls", { //第一个参数"mescroll"对应上面布局结构div的id
                up: {
                    loadFull: {
                        use: false, //列表数据过少,是否自动加载下一页,直到满屏或者无更多数据为止;默认false
                        delay: 500 //延时执行的毫秒数; 延时是为了保证列表数据或占位的图片都已初始化完成,且下拉刷新上拉加载区域动画已执行完毕;
                    },
                    page: {
                        num: 0, //当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                        size: 10//每页数据的数量
                    },
                    callback: getListDatas, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
                    isBounce: false, //此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10clearEmptyId: "dataList" //1.下拉刷新时会自动先清空此列表,再加入数据; 2.无任何数据时会在此列表自动提示空
                    /* toTop:{ //配置回到顶部按钮
                            src : "../res/img/mescroll-totop.png" //默认滚动到1000px显示,可配置offset修改
                            //offset : 1000
                    }*/
                }
            });
   /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
    function getListDatas(page){
        //联网加载数据
        getListDataFromNets(page.num, page.size, function(data){
            console.log(data)
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
             console.log("page.num="+page.num+", page.size="+page.size+", data.length="+data.content.length);

            //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
             mescroll.endSuccess(data.content.length);

            //设置列表数据,因为配置了emptyClearId,第一页会清空dataList的数据,所以setListData应该写在最后;
            setListDatas(data);
        }, function(){
            //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
            mescroll.endErr();
        });
    }
        //上拉加载的回调 page = {num:1, size:10}; num:当前页 默认从1开始, size:每页数据条数,默认10
         function setListDatas(data,pageNum){
            // 加载“我的医生”的数据
        	
                     var content=data.content;
                     var html="";
                     console.log("data:::::::");
                     console.log(content);
                      totalPage=data.totalPage; 
                      //如果传了hasNext,则翻到第二页即可显示无更多数据.
                    mescroll.endSuccess(content.length);
                    $.each(content,function(k,el){
                            html+='<tr>'+
            						'<td style="margin-left:1px;">'+el.orderNum+'</td>'+
            						'<td style="margin-left:5px;">'+el.dateCreate+'</td>'+
            						'<td style="margin-left:5px;">'+el.rkDate+'</td>'+
            						'<td style="margin-left:6px;">'+el.orderPrice+'</td>'+
            					   '</tr>'
                            
                    })
                         $(".accumulativemain_tbody tbody").html(html);
                          html="";
                         //累计订单金额
                         $(".accumulativetext span").text(data.totalOrderPrice);
                         $(".shut").on("click",function(){
                            $(".accumulative").hide()
                            $(".accumulativemain_tbody tbody").html("");
                       })
                   
        		
        }
        var redPacketInfoIds=redPacketInfoId;
    function getListDataFromNets(pageNum,pageSize,successCallback,errorCallback) {
        
        //延时一秒,模拟联网
        setTimeout(function () {//ff808081636cc9ab01636ce890fe001a
            $.ajax({
                url:commonUrl+'redPacketInfo/redPacketOrderInfoList?redPacketInfoId=ff808081636cc9ab01636ce890fe001a&page='+pageNum+'&pageSize='+pageSize,
                type: 'post',
                async: false,
                dataType: 'json',
                success: function(data){
                   // console.log(data)
                    successCallback(data);
                },
                error: errorCallback
            });

        },500)
        if($(".mescroll-upwarp").is(":visible")==true){
           $(".mescroll-upwarp").css({"padding":"0px","min-height":"0"})
        }else{
             $(".mescroll-upwarp").css({"padding":"15px 0","min-height":"30px"})
        }
    }
}
//返回上一页
$(".arrowLeft").on("click",function(){
    window.history.go(-1);
})