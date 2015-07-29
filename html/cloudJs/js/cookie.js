/**
 * 浏览器缓存组件
 * author: amixu@tencent.com
 * date: 2015-07-01
 */

cloudjs.define({
    cookie: function(options){
        if(options === 'setCookie'){
            _setCookie(arguments[1]);
        }else if(options === 'getCookie'){
            cloudjs.callback(_getCookie(arguments[1]));
        }else if(options === 'getCookieObj'){
            var obj = _getCookie(arguments[1]);
            try{
                obj = $.parseJSON(obj);
            }catch(err){
                cloudjs.util.log(err);
            }
            cloudjs.callback(obj);
        }else if(options === 'removeCookie'){
            _setCookie({ name: arguments[1], value: '', expires: -1 });
        }
        
        /**
        * 设置cookie
        * @param {Object} obj 包括4个参数name,value,allPath,expires
        */
        function _setCookie(obj){
            var val = obj.value, expires = '', path = obj.allPath ? '; path=/' : '';
            if(obj.expires && typeof obj.expires === 'number'){
                var date = new Date();
                date.setTime(date.getTime() + (obj.expires * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toUTCString();
            }
            if(typeof val === 'object'){
                try{
                    val = JSON.stringify(val);
                }catch(err){
                    cloudjs.util.log(err);
                    return;
                }
            }
            document.cookie = [obj.name, '=', encodeURIComponent(val), expires, path].join('');
        }
        
        /**
        * 获取cookie
        * @param {String} name cookie名
        * @return {String} cookie值
        */
        function _getCookie(name){
            var cookieValue = null;
            if (document.cookie && document.cookie !== ''){
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++){
                    var cookie = jQuery.trim(cookies[i]);
                    if (cookie.substring(0, name.length + 1) === (name + '=')){
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    }
});