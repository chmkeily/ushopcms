var Ushop = function(){
    var scope = this;

    scope.initNewTabLink = function(){
        $('.js_url').live('click', function(){
            var title = $(this).attr('tabTitle') || $(this).text();
            if( typeof(window.parent.addTab) === 'function' ){
                window.parent.addTab(title,$(this).attr('href'));
                return false;
            }
        });
    };
    scope.initNewTabLink();
    
    /**
     * 时间戳转成字符串
     * @param {String/Number} stamp 时间戳
     * @param {String} format 转成的时间格式
     */
    scope.getTimeByShortStamp = function(stamp, format){
        if(isNaN(parseInt(stamp, 10))){
            return '--';
        }
        stamp = parseInt(stamp, 10) * 1000;
        stamp = stamp + '';
        stamp = parseInt(stamp, 10);
        format = format || 'yyyy-MM-dd hh:mm:ss';
        var time = format,
            new_date = new Date(stamp);     
        
        time = time.replace('yyyy', new_date.getFullYear());
        time = time.replace('MM', new_date.getMonth() + 1 < 10 ? '0' + (new_date.getMonth() + 1) : new_date.getMonth() + 1);
        time = time.replace('dd', new_date.getDate() < 10 ? '0' + new_date.getDate() : new_date.getDate());
        time = time.replace('hh', new_date.getHours() < 10 ? '0' + new_date.getHours() : new_date.getHours());
        time = time.replace('mm', new_date.getMinutes() < 10 ? '0' + new_date.getMinutes() : new_date.getMinutes());
        time = time.replace('ss', new_date.getSeconds() < 10 ? '0' + new_date.getSeconds() : new_date.getSeconds());
        
        return time;
    };

    /**
     * 字符串转成时间戳
     * @param {String} str 时间字符串
     * @param {String} date_sign 日期分隔符号
     * @param {String} time_sign 时间分隔符号
     */
    scope.getShortStampByString = function(str, date_sign, time_sign){
        var stamp;
        if(date_sign){
            str = str.replace(date_sign, '/').replace(date_sign, '/');
        }
        if(time_sign){
            str = str.replace(time_sign, '/').replace(time_sign, '/');
        }
        
        stamp = (new Date(str)).getTime()/1000;

        return stamp;
    };
};

var ushop = new Ushop();


jQuery.prototype.serializeObject=function(){  
    var obj=new Object();  
    $.each(this.serializeArray(),function(index,param){  
        if(!(param.name in obj)){  
            obj[param.name]=param.value;
        }  
    });
    return obj;
};
