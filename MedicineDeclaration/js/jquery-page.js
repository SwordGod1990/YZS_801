(function (b) {
    var a = {
        init: function (d, c) {
            return (function () {
                a.fillHtml(d, c);
                a.bindEvent(d, c)
            })()
        }, fillHtml: function (d, c) {
            return (function () {
                d.empty();
                if (c.current > 1) {
                    d.append('<strong class="prevPage">上一页</strong>');
//                    d.append('<strong class="homepage" id="homePage">首页</strong>');
                } else {//位于第1页，则上一页和首页不可点击
                    d.remove(".prevPage");
                    d.remove(".homepage");
                    d.append('<span class="disabled">上一页</span>');
//                    d.append('<span class="disabled">首页</span>');
                }
                if (c.current != 1 && c.current >= 4 && c.pageCount != 4) {
                    d.append('<i class="tcdNumber">' + 1 + "</i>")
                }
                if (c.current - 2 > 2 && c.current <= c.pageCount && c.pageCount > 5) {
                    d.append("<span>...</span>")
                }
                var f = c.current - 2, e = c.current + 2;
                if ((f > 1 && c.current < 4) || c.current == 1) {
                    e++
                }
                if (c.current > c.pageCount - 4 && c.current >= c.pageCount) {
                    f--
                }
                for (; f <= e; f++) {
                    if (f <= c.pageCount && f >= 1) {
                        if (f != c.current) {
                            d.append('<i class="tcdNumber">' + f + "</i>")
                        } else {
                            d.append('<span class="current">' + f + "</span>")
                        }
                    }
                }
                if (c.current + 2 < c.pageCount - 1 && c.current >= 1 && c.pageCount > 5) {
                    d.append("<span>...</span>")
                }
                if (c.current != c.pageCount && c.current < c.pageCount - 2 && c.pageCount != 4) {
                    d.append('<i class="tcdNumber">' + c.pageCount + "</i>")
                }
                if (c.current < c.pageCount) {
                    d.append('<strong class="nextPage">下一页</strong>')
                } else {
                    d.remove(".nextPage");
                    d.append('<span class="disabled">下一页</span>')
                }
                /*d.append('<a href="javascript:;" class="endpage" id="endPage">末页</a>');*/
                if (c.display == 1) {
                    d.append('<div class="page_msg">共<span>'+totalPage +'</span>页<span></div>');
                    d.append('<div class="page_msg page_msgTo">到</div>');
                    d.append('<input type="text" name="" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^0-9]/g,\'\')}else{this.value=this.value.replace(/\\D/g,\'\')}" value="1" class="skip_inter"><div class="page_msg">页</div>');
                    d.append('<input type="button" name="" value="GO" class="page_true">');

                }
            })()
        }, bindEvent: function (d, c) {
            return (function () {
                d.on("click", "i.tcdNumber", function () {
                    var e = parseInt(b(this).text());
                    a.fillHtml(d, {current: e, pageCount: c.pageCount, display: c.display});
                    if (typeof(c.backFn) == "function") {
                        c.backFn(e)
                    }
                });
                d.on("click", "strong.prevPage", function () {
                    var e = parseInt(d.children("span.current").text());
                    a.fillHtml(d, {current: e - 1, pageCount: c.pageCount, display: c.display});
                    if (typeof(c.backFn) == "function") {
                        c.backFn(e - 1)
                    }
                });
                d.on("click", "strong.nextPage", function () {
                    var e = parseInt(d.children("span.current").text());
                    a.fillHtml(d, {current: e + 1, pageCount: c.pageCount, display: c.display});
                    if (typeof(c.backFn) == "function") {
                        c.backFn(e + 1)
                    }
                });
                d.on("click", "#homePage", function () {
                    var e = 1;
                    a.fillHtml(d, {current: e, pageCount: c.pageCount, display: c.display});
                    if (typeof(c.backFn) == "function") {
                        c.backFn(e)
                    }
                });
                d.on("click", "#endPage", function () {
                    var e = c.pageCount;
                    a.fillHtml(d, {current: e, pageCount: c.pageCount, display: c.display});
                    if (typeof(c.backFn) == "function") {
                        c.backFn(e)
                    }
                });
                d.on("click", "input.page_true", function () {
                    var num =d.children("input.skip_inter").val();
                    if(num == ""){
                        num =1;
                    }
                    var e = parseInt(num);
                    e=e>fenPage?fenPage:e;//如果输入的页数大于总页数，则定位到最后一页
                    e=e<1?1:e;//如果输入的页数小于1，则定位到第一页
                    a.fillHtml(d, {current: e, pageCount: c.pageCount, display: c.display});
                    if (typeof(c.backFn) == "function") {
                        c.backFn(e);
                        d.children("input.skip_inter").val(e)
                    }
                })
            })()
        }
    };
    b.fn.createPage = function (d) {
        var c = b.extend({
            pageCount: 10, current: 1, display: 1, backFn: function () {
            }
        }, d);
        a.init(this, c)
    }
})(jQuery);