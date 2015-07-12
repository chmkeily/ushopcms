cloudjs.define({

    message: function(options){

        var defaults = {
            type: 'success', // 消息框的类型，可选'success','warn','error'
            content: '提示信息', // 消息框中的提示内容
            duration: 3000, // 消息框保留的时间
            isShowIcon: false, //左上角是否展示icon
            relative: document, // 消息框所处的容器，默认为document
            position: 'in_top',// 消息框相对于容器的位置，可选'in_top','left','right','up','down'
            offsetLeft: 0, // 消息框相对于容器顶部中心的横向偏移值
            offsetTop: 0, // 消息框相对于容器顶部的纵向偏移值
            id: null, // 自定义消息框id
            isTriggerClose: false //是否点击页面其他元素自动关闭消息框
        };

        if(options && $.isPlainObject(options)){
            $.extend(defaults, options);
        }else if(options === 'close'){
            if(arguments[1] && arguments[1].id){
                _hide(arguments[1].id);
            }else{
                _hide('all');
            }
            return true;
        }

        var _msgBox = null,
            _msgCon = null,
            _msgClose = null,
            _timeout = null,
            _type = cloudjs.util.indexOf(['success', 'warn', 'error'], defaults.type) === -1 ? 'success' : defaults.type,
            _content = defaults.content,
            _duration = defaults.duration < 0 ? 5000 : defaults.duration,
            _isShowIcon = defaults.isShowIcon,
            _relative = defaults.relative,
            _position = cloudjs.util.indexOf(['in_top', 'left', 'right', 'up', 'down'], defaults.position) === -1 ? 'in_top' : defaults.position,
            _offsetLeft = defaults.offsetLeft,
            _offsetTop = defaults.offsetTop,
            _isFull = defaults.isFull || false,
            _id = defaults.id ? ('mes_' + defaults.id + '_' + Math.random()) : null,
            _isTriggerClose = defaults.isTriggerClose || false;

        _init();

        /**
         * 初始化消息组件
         */
        function _init(){
            _addBox();
            _show();
        }

        /**
         * 生成消息组件的html节点
         */
        function _addBox(){
            var html = '';
            _msgBox = $('<div></div>').addClass('message_div').addClass(Math.random().toString());
            _id && _msgBox.attr('id', _id);
            html = '<div class="message_con ' + (_isShowIcon ? '' : 'message_no_icon ' ) + 'message_' +  _type + '">';
            if(_isShowIcon){
                html += '<p class="message_icon cloud_icon"></p>'
            }
            html += '<span>' + _content + '</span><p class="message_close">×</p></div>';
            _msgBox.appendTo('body')
                .html(html);
            _msgCon = _msgBox.children();
            _msgClose = _msgCon.find('>.message_close');
        }

        /**
         * 设置消息组件的位置和尺寸
         */
        function _setStyle(){
            var reElem = null, oTop = 0, oLeft = 0, oWidth = 0, oHeight = 0, style = {},
                msgWidth = 0, msgHeight = 0;
            if(_relative.nodeType === 9){
                reElem = $(document);
                $(_msgBox).css({position: 'fixed'});
                style.top = _offsetTop;
                msgWidth = $(_msgBox).width();
                oWidth = reElem.width();
                if(_isFull) {
                    style.width = oWidth;
                    style.left = 0;
                }else{
                    style.left = oWidth / 2 - msgWidth / 2 + _offsetLeft;
                }
                $(_msgBox).css(style);
            }else{
                $(_msgBox).css({position: 'absolute'});
                reElem = $(_relative);
                oTop = reElem.offset().top;
                oLeft = reElem.offset().left;
                oWidth = reElem.outerWidth();
                oHeight = reElem.outerHeight();
                msgWidth = $(_msgBox).outerWidth();
                if(_isFull){
                    style.width = oWidth;
                    style.left = oLeft;
                    style.top = oTop + _offsetTop;
                    $(_msgBox).css(style);
                }else if((/^in_/).exec(_position)){
                    style.width = Math.min(msgWidth, oWidth);
                    style.left = oLeft + (oWidth - msgWidth) / 2 + parseInt(_offsetLeft);
                    style.top = oTop + _offsetTop;
                    $(_msgBox).css(style);
                }else{
                    $(_msgBox).css({'width': msgWidth});
                    msgWidth = $(_msgBox).outerWidth();
                    msgHeight = $(_msgBox).outerHeight();
                    switch(_position){
                        case 'up':
                            style.top = oTop - msgHeight + _offsetTop;
                            style.left = oLeft + (oWidth - msgWidth) / 2 + parseInt(_offsetLeft) + _offsetLeft;
                            break;
                        case 'down':
                            style.top = oTop + oHeight + _offsetTop;
                            style.left = oLeft + (oWidth - msgWidth) / 2 + parseInt(_offsetLeft) + _offsetLeft;
                            break;
                        case 'left':
                            style.top = oTop + _offsetTop;
                            style.left = oLeft - msgWidth + _offsetLeft;
                            break;
                        case 'right':
                            style.top = oTop + _offsetTop;
                            style.left = oLeft + oWidth + _offsetLeft;
                            break;
                        default:
                            break;
                    }
                    $(_msgBox).css(style);
                }
            }
        }


        /**
         * 展开消息组件，设置关闭消息组件的计时器，window发生resize时候自适应位置
         */
        function _show(){
            $('body').append(_msgBox);
            _setStyle();
            _msgCon.stop().animate({top: '0px'}, 200);
            if(_duration > 0 && _timeout == null){
                _timeout = setTimeout(function(){
                    _hide();
                }, _duration);
            }
            _msgClose.bind('click', function(){
                _hide();
            });
            var randomEvent = 'message' + Math.random();
            if(_isTriggerClose){
                setTimeout(function(){
                    $('html').bind('click.' + randomEvent, function(e){
                        var target = $(e.target);
                        if(target.is(_msgBox)){
                            return;
                        }
                        var jqObj = $(e.target).parents('.message_div');
                        if(jqObj && jqObj.is(_msgBox)){
                            return;
                        }
                        if(_msgBox && _msgBox.parent()[0]){
                            _hide();
                            $('html').unbind('click.' + randomEvent);
                            _msgBox = null;
                        }
                    });
                }, 10);
            }
            $(window).bind('resize.' + randomEvent, function(){
                if(_msgBox && _msgBox.parent()[0]){
                    _setStyle();
                }else{
                    $(window).unbind('resize.' + randomEvent);
                }
            });
        }

        /**
         * 关闭消息组件
         * @param {string | Array} id 关闭的消息组件id，若不传id，则关闭当前，若id为‘all’，则关闭全部消息组件
         */
        function _hide(id){
            if(!id){
                _doHide(_msgBox);
                clearTimeout(_timeout);
                _timeout = null;
            }else if(id === 'all'){
                _doHide($('.message_div'));
                clearTimeout(_timeout);
                _timeout = null;
            }else{
                if(typeof id === 'string'){
                    _doHide($('.message_div[id^="mes_' + id + '_"]'));
                }else if($.isArray(id)){
                    for(var i = 0, len = id.length; i<len; i++){
                        _doHide($('.message_div[id^="mes_' + id[i] + '_"]'));
                    }
                }
            }
        }

        /**
         * 执行关闭组件动作
         * @param {object} obj 被关闭的消息组件jQuery对象
         */
        function _doHide(obj){
            if(!obj){
                return;
            }
            obj.each(function(){
                var $this = $(this), msgCon = $this.children('.message_con');
                msgCon.stop().animate({top: ( - msgCon.height() - 10) + 'px'}, 200, function(){
                    $this.remove();
                });
            });
        }
    },
    require: ['../css/blue/message.css']
});