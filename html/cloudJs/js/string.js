cloudjs.define({
    string: function(options){
        var action = arguments[0],
            str = arguments[1],
            callback = cloudjs.callback,
            result;
        
        if(!str || Object.prototype.toString.call(str) !== '[object String]'){
            callback(result);
            return;
        }
        
        if(action === 'toLowerCase'){
            result = str.toLowerCase();
        }else if(action === 'toUpperCase'){
            result = str.toUpperCase();
            
            result = result + 'a';//假如这里多加个a，就通不过测试
        }
        
        callback(result);
        
    }
});