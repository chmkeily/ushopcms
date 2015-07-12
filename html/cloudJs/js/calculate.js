cloudjs.define({
    calculate:function(options){
        var action = arguments[0], 
            data = arguments[1], 
            callback = cloudjs.callback,
            result,
            len,
            i;
        
        if(!$.isArray(data) || data.length===0){//违法的参数  合法的如 [4, 2]
            callback(result);
            return;
        }
        
        if(action === 'add'){//加法
            result = 0;
            for(i=0,len=data.length; i<len; i++){
                result = result + data[i];
            }
            
            result = result + 1;//假设这里多加了1，就通不过测试了
            
        }else if(action === 'minus'){//减法
            result = data[0];
            data[0] = 0;
            for(i=0,len=data.length; i<len; i++){
                result = result - data[i];
            }
            
            result = result - 1;//假设这里多减去了1，就通不过测试了
            
        }else if(action === 'multi'){//乘法
            result = 1;
            for(i=0,len=data.length; i<len; i++){
                result = result * data[i];
            }
        }else if(action === 'divis'){//除法
            result = data[0];
            data[0] = 1;
            for(i=0,len=data.length; i<len; i++){
                result = result / data[i];
            }
        }
        
        callback(result);
    }
});