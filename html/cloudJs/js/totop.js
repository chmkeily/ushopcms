/**
 * 返回顶部组件
 * author: amixu@tencent.com
 * date: 2015-07-01
 */

cloudjs.define({
    totop: function(options){
        var defaults = {
            bottom: 0,  //相对屏幕底部的距离
            right: 0,   //相对屏幕右侧的距离
            isScroll: true,  //是否在滚动条向下滚动时才出现
            scrollHeight: 200,  //滚动到多高时才出现
            img: '../../images/totop.png',  //默认展示的图片
            hoverImg: ''   //hover状态下展示的图片
        };
        $.extend(defaults,options);
        var _self,
            _scrollHeight = defaults.scrollHeight,
            _img = defaults.img,
            _hoverImg = defaults.hoverImg,
            _totopHtml = '<a href="#" style="dispaly:none;z-index:99999;position:fixed;bottom:' + defaults.bottom + 'px;right:' + defaults.right + 'px';
        if(_hoverImg){
            _totopHtml += '">';
        }else{
            _totopHtml += ';opacity:0.7;filter:alpha(opacity=70);">';
        }
        _totopHtml += '<img style="float:left;" src="' + _img + '" /></a>';
        
        _self = $(_totopHtml).appendTo('body');
        
        if(defaults.isScroll){
            if($(document).scrollTop() > _scrollHeight){
                _self.show();
            }else{
                _self.hide();
            }
            $(window).scroll(function(){ 
                
                if($(document).scrollTop() > _scrollHeight){
                    _self.show();
                }else{
                    _self.hide();
                }
            });
        }else{
            _self.show();
        }
        _self.hover(
            function(){
                hoverTop(this, 1);
            },
            function(){
                hoverTop(this, 0.7);
            }
        );
        
        /**
         * hover效果
         * @param {Object} obj hover对象
         * @param {Number} alpha 透明度
         */
        function hoverTop(obj, alpha){
            if(_hoverImg){
                if(alpha === 1){
                    $(obj).find('img').attr('src', _hoverImg);
                }else{
                    $(obj).find('img').attr('src', _img);
                }
            }else{
                $(obj).css({ opacity: alpha, filter: 'alpha(opacity=' + alpha*100 + ')' });
            }
        }
    }
});