
    function setupWebViewJavascriptBridge(callback) {
        //Android使用
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function() {
                    callback(WebViewJavascriptBridge)
                },
                false
            );
        }
        //ios使用
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__ ';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
//调用原生方法实现返回
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler('testJavascriptHandler', function (data, responseCallback) {
            log('ObjC called testJavascriptHandler with', data)
            var responseData = { 'Javascript Says': 'Right back atcha!' }
            log('JS responding with', responseData)
            responseCallback(responseData)
        })
        var goBackBtn = document.getElementById("goBack");
        goBackBtn.onclick = function (e) {

            console.log('JS got response')
            e.preventDefault()
            bridge.callHandler('closefullCallback', function (response) {
                log('JS got response', response)
            })
        }
    })
