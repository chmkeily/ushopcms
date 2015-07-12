cloudjs.define({
    dialog: function(options){
        var defaults = {
            modal: false, //是否模态窗口打开，如果是则弹出框后面会有一层遮罩，页面的内容会被遮住不可点
            title: '系统提示', //设置对话框标题
            width: '', //设置对话框的宽
            height: '', //设置对话框的高
            buttons: null, //对话框的按钮，对应的按钮设置为[{“按钮名称”：“回调方法”}]
            draggable: true, //对话框是否可以拖动
            resizable: true, //对话框是否可以改变大小
            fullscreen: false, //对话框是否支持全屏操作
            animate: false, //是否通过动画打开和消失
            relative: '', //弹出的对话框相对的元素，有箭头的对话框
            position: '', //弹出的对话框相对的元素的位置
            onCreate: $.noop, //在对话框刚刚创建时调用，该方法在对话框的生命周期中只会调用一次
            onOpen: $.noop, //在对话框打开时创建，对于被close的对话框，在通过动作open打开时，该方法也会调用
            onClose: $.noop, //在对话框被关闭时调用，一个destroy的对话框，onClose方法会发生在onDestroy之前
            onDestroy: $.noop, //一个对话框被销毁时调用，该方法在对话框的生命周期中只会调用一次
            onFullscreen: $.noop, //当全屏时触发的事件
            onRecover: $.noop, //当从全屏还原时触发的事件
            onResizeStart: $.noop, //开始缩放时调用
            onResize: $.noop, //缩放时调用
            onResizeStop: $.noop, //结束缩放时调用
            onDragStart: $.noop, //开始拖动时调用
            onDrag: $.noop, //拖动时调用
            onDragStop: $.noop, //拖动结束时调用
            onTitleChange: $.noop, //标题变化时调用
            onContentChange: $.noop //内容变化时调用
        };
        
        var _self = this,
            _dialogObj,
            _dialogBtns = {},
            DEFAULT_WIDTH = 200,
            DEFAULT_HEIGHT = 'auto',
            DIALOG_DIV = 'dialog_div',
            DIALOG_ARROW = 'dialog_arrow',
            ARROW_WIDTH = 8,
            ARROW_DOWN = 'down', //正下方
            ARROW_LEFT = 'left', //正左方
            ARROW_RIGHT = 'right', //正右方
            ARROW_UP = 'up', //正上方
            ARROW_DOWN_LEFT = 'down_left', //下方偏左
            ARROW_DOWN_RIGHT = 'down_right', //下方偏右
            ARROW_UP_LEFT = 'up_left', //上方偏左
            ARROW_UP_RIGHT = 'up_right', //上方偏右
            SPACING = 2,
            LEFT_EDG = 6,
            RIGHT_EDG = 10,
            _dragBinded = false,
            _resizeBinded = false,
            _minHeight = 106,
            _minWidth = 200,
            _lastWidth,
            _lastHeight,
            _lastLeft,
            _lastTop,
            _args0,
            _args1;

        cloudjs._dialogZindex = (cloudjs._dialogZindex || 11111) + 2;
        if(cloudjs._dialogAnimating){//如果在animate的过程中操作，会有问题
            return;
        }

        _args0 = arguments[0];
        _args1 = arguments[1];

        if(!options || $.isPlainObject(options)){
            options = options || {};
            if(_self[0]){

                if(_self[0]._dialogTitle){
                    defaults.title = _self[0]._dialogTitle;
                }else if(_self.attr('title')){
                    _self[0]._dialogTitle = defaults.title = _self.attr('title');
                }
                _self.removeAttr('title');

                if(_self[0]._dialogWidth){
                    defaults.width = _self[0]._dialogWidth;
                }else if(_self[0].style.width){
                    _self[0]._dialogWidth = defaults.width = _autoWidth(_self[0].style.width);
                }else if(_self.attr('width')){
                    _self[0]._dialogWidth = defaults.width = _autoWidth(_self[0].style.width = _self.attr('width') + 'px');
                }

                if(_self[0]._dialogHeight){
                    defaults.height = _self[0]._dialogHeight;
                }else if(_self[0].style.height){
                    _self[0]._dialogHeight = defaults.height = _autoHeight(_self[0].style.height);
                }else if(_self.attr('height')){
                    _self[0]._dialogHeight = defaults.height = _autoHeight(_self[0].style.height = _self.attr('height') + 'px');
                }

                if(options.height){
                    options.height = _autoHeight(options.height);
                }
                if(options.width){
                    options.width = _autoWidth(options.width);
                }

                _self.removeAttr('width');
                _self.removeAttr('height');

                $.extend(true, defaults, options);

                _self[0]._cloudjsDialogObj && _self[0]._cloudjsDialogObj.destroy();
                _init();
                _self[0]._cloudjsDialogObj = _dialogObj;
            }else{
                cloudjs.util.error('调用dialog组件失败， ' + _self.selector + ' 找不到相应的元素!');
            }
        }else if(_self.length && (_dialogObj = _self[0]._cloudjsDialogObj)){
            defaults = _dialogObj._defaults;
            if(_args0 === 'destroy'){
                _dialogObj.destroy();
            }else if(_args0 === 'close'){
                _dialogObj.close();
            }else if(_args0 === 'open'){
                if(!_args1 || !$.isPlainObject(_args1)){
                    _args1 = {};
                }
                if(_args1.height){
                    _args1.height = _autoHeight(_args1.height);
                }
                if(_args1.width){
                    _args1.width = _autoWidth(_args1.width);
                }
                $.extend(true, defaults, _args1);
                _init();
            }else if(_args0 === 'addButton'){
                if(_args1 && $.isPlainObject(_args1)){
                    _dialogObj.addButton(_args1);
                }
            }else if(_args0 === 'removeButton'){
                if(typeof _args1 === 'string'){
                    _dialogObj.removeButton(_args1);
                }
            }else if(_args0 === 'disableButton'){
                if(typeof _args1 === 'string'){
                    _dialogObj.disableButton(_args1);
                }
            }else if(_args0 === 'enableButton'){
                if(typeof _args1 === 'string'){
                    _dialogObj.enableButton(_args1);
                }
            }else if(_args0 === 'showButton'){
                if(typeof _args1 === 'string'){
                    _dialogObj.showButton(_args1);
                }
            }else if(_args0 === 'hideButton'){
                if(typeof _args1 === 'string'){
                    _dialogObj.hideButton(_args1);
                }
            }else if(_args0 === 'setTitle'){
                if(typeof _args1 === 'string'){
                    _dialogObj.setTitle(_args1);
                }
            }
        }else{
            var tempFun = function(){this.close();};
            if(_args0 === 'alert'){
                if(_args1 && !$.isPlainObject(_args1)){
                    _args1 = {};
                }
                _alert(_args1.content || '', _args1.relative || '', _args1.position || '');
            }else if(_args0 === 'confirm'){
                if(_args1 && !$.isPlainObject(_args1)){
                    _args1 = {};
                }
                _confirm(_args1.content || '', _args1.relative || '', _args1.position || '', _args1.ok || tempFun, _args1.no || tempFun);
            }else if(_args0 === 'prompt'){
                if(_args1 && !$.isPlainObject(_args1)){
                    _args1 = {};
                }
                _prompt(_args1.content || '', _args1.relative || '', _args1.position || '', _args1.ok || tempFun, _args1.empty || false);
            }
        }

        cloudjs.callback(_dialogObj);

        function _init(){
            var dialog;

            _dialogObj = _dialogObj || _getDialogObj();
            dialog = _dialogObj.dialog;

            if(_dialogObj._fullscreen){
                _dialogObj._fullscreen = false;
                _unfixed(dialog);
            }

            defaults.width = defaults.width || DEFAULT_WIDTH;
            defaults.height = defaults.height || DEFAULT_HEIGHT;

            _dialogObj.setWidth(defaults.width);
            _dialogObj.setHeight(defaults.height);
            _dialogObj.setTitle(defaults.title);
            _dialogObj.setContent(_self.show());
            _dialogObj.setButtons(defaults.buttons);

            if($(defaults.relative).length === 0){
                _dialogObj.draggable(defaults.draggable);
                _dialogObj.resizable(defaults.resizable);
            }
            _dialogObj.setPosition(defaults.relative, defaults.draggable, defaults.position, true);
            _dialogObj.setModal(defaults.modal);
            _dialogObj.open();
            _dialogObj.onSizeChange();
        }

        /**
         * 模拟浏览器的alert弹框
         * @param {String} content 弹框内容
         * @param {String|Object} relative 弹框相对元素
         * @param {String} position 弹框相对位置
         */
        function _alert(content, relative, position){
            var modal = false, dialogObj;
            if($(relative).length === 0){
                modal = true;
            }else if(dialogObj = $(relative)[0]._alert){
                dialogObj.open();
                return;
            }
            cloudjs('<div>' + content + '</div>').dialog({
                title: '系统提示',
                modal: modal,
                animate: true,
                relative: relative,
                position: position,
                width: 232,
                resizable: false,
                buttons: {
                    '确定': function(){
                        this.close();
                    }
                }
            }, function(dialogObj){
                if(!modal){
                    $(relative)[0]._alert = dialogObj;
                }
            });
        }

        /**
         * 模拟浏览器的_confirm确认框
         * @param {String} content 确认框内容
         * @param {String|Object} relative 确认框相对元素
         * @param {String} position 弹框相对位置
         * @param {Function} ok 点击确认时调用的方法
         * @param {Function} no 点击取消时调用的方法
         */
        function _confirm(content, relative, position, ok, no){
            var modal = false, dialogObj;
            if($(relative).length === 0){
                modal = true;
            }else if(dialogObj = $(relative)[0]._confirm){
                dialogObj.open();
                return;
            }
            cloudjs('<div>' + content + '</div>').dialog({
                title: '系统提示',
                animate: true,
                modal: modal,
                relative: relative,
                position: position,
                width: 232,
                resizable: false,
                buttons: {
                    '确定': ok,
                    '取消': no
                }
            }, function(dialogObj){
                if(!modal){
                    $(relative)[0]._confirm = dialogObj;
                }
            });
        }

        /**
         * 模拟浏览器的_prompt输入框
         * @param {String} content 提示内容
         * @param {String|Object} relative 确认框相对元素
         * @param {String} position 弹框相对位置
         * @param {Function} ok 点击确认时调用的方法
         * @param {Boolean} require 输入框是否必填
         */
        function _prompt(content, relative, position, ok, empty){
            var str = '<div>' + content + '</div>', width = 274, modal = false, dialogObj;

            if(empty){
                str += ('<textarea class="dialog_div_body_textarea" style="width:' + (width - 14) + 'px"></textarea>');
                str += '<span class="dialog_div_body_empty">*</span>';
            }else{
                str += ('<textarea class="dialog_div_body_textarea" style="width:' + (width - 7) + 'px"></textarea>');
            }
            if($(relative).length === 0){
                modal = true;
            }else if(dialogObj = $(relative)[0]._prompt){
                dialogObj.destroy();
            }
            cloudjs(str).dialog({
                title: '系统提示',
                animate: true,
                modal: modal,
                relative: relative,
                position: position,
                width: width,
                resizable: false,
                buttons: {
                    '确定': function(){
                        var textarea = this.dialog.find('.dialog_div_body_textarea'), _this = this;
                        if(this.dialog.find('.dialog_div_body_empty').length){
                            if($.trim(textarea.val())){
                                ok.call(_this, textarea.val());
                            }else{
                                textarea.addClass('dialog_div_body_textarea_empty');
                                textarea.one('focus', function(){
                                    textarea.removeClass('dialog_div_body_textarea_empty');
                                });
                            }
                        }else{
                            ok.call(this, textarea.val());
                        }
                    }
                },
                onClose: function(){
                    this.dialog.find('.dialog_div_body_textarea').removeClass('dialog_div_body_textarea_empty');
                }
            }, function(dialogObj){
                if(!modal){
                    $(relative)[0]._prompt = dialogObj;
                }
            });
        }

        /**
         * 转换高度值
         * @param {Number} height 需要转换的高
         * @return {Number} 返回转换后的高
         */
        function _autoHeight(height){
            var _height;

            _height = parseInt(height) + 78;

            return _height;
        }

        /**
         * 转换宽度值
         * @param {Number} width 需要转换的宽
         * @return {Number} 返回转换后的宽
         */
        function _autoWidth(width){
            var _width;

            _width = parseInt(width) + 18;

            return _width;
        }

        /**
         * 创建dialog对象和其操作方法
         * @return {Object} 返回创建好的dialog对象
         */
        function _getDialogObj(){
            var dialog = '', dialogObj, title, headTitle, closeBtn, fullscreenBtn, backScreenBtn, head, body, foot,
                bodyOverX = $('body').css('overflowX'), bodyOverY = $('body').css('overflowY');

            dialog += '<div class="';
            dialog += DIALOG_DIV;
            dialog += '">';
            dialog += '<div class="dialog_div_head">';
            dialog += '<span class="dialog_div_head_title"></span>';
            dialog += '<span class="dialog_div_head_btn dialog_div_head_close_btn cloud_icon" title="关闭"></span>';
            dialog += '<span class="dialog_div_head_btn dialog_div_head_backscreen_btn cloud_icon" title="还原"></span>';
            dialog += '<span class="dialog_div_head_btn dialog_div_head_fullscreen_btn cloud_icon" title="全屏"></span></div>';
            dialog += '<div class="dialog_div_body"></div>';
            dialog += '<div class="dialog_div_foot"></div>';
            dialog += '</div>';

            dialog = $(dialog).appendTo('body').hide();
            dialog.css('zIndex', cloudjs._dialogZindex);
            headTitle = dialog.find('.dialog_div_head_title');
            closeBtn = dialog.find('.dialog_div_head_close_btn');
            fullscreenBtn = dialog.find('.dialog_div_head_fullscreen_btn');
            backScreenBtn = dialog.find('.dialog_div_head_backscreen_btn');

            head = dialog.find('.dialog_div_head');
            body = dialog.find('.dialog_div_body');
            foot = dialog.find('.dialog_div_foot');

            dialogObj = {
                _defaults: defaults,
                _bodyOverX: bodyOverX,
                _bodyOverY: bodyOverY,
                dialog: dialog,
                close: function(){//关闭
                    if(dialogObj._fullscreen){
                        backScreenBtn.hide();
                        dialogObj._defaults.fullscreen && fullscreenBtn.show();
                        body.height(_lastHeight - head.outerHeight() - foot.outerHeight() - _boxSpace(body).v);
                        _unfixed(dialog);
                    }else{
                        _lastStatus();
                    }
                    dialogObj.onClose();
                    dialogObj.dialog.hide();
                    _self.hide();
                    _hideLayer();
                    dialogObj._fullscreen = false;
                },
                open: function(){//打开
                    dialogObj.setPosition(dialogObj._defaults.relative, dialogObj._defaults.draggable, dialogObj._defaults.position, false);
                    dialogObj.onOpen();
                    dialogObj.dialog.show();
                    _self.show();
                    dialogObj._defaults.animate && _animateOpen(dialogObj.onSizeChange);
                },
                destroy: function(){//销毁
                    dialogObj.close();
                    dialogObj.onDestroy.call(dialogObj);
                    _self.appendTo('body');
                    _self[0]._dialogTitle && _self.attr('title', _self[0]._dialogTitle);
                    _self[0]._dialogWidth && _self.attr('width', _self[0]._dialogWidth);
                    _self[0]._dialogHeight && _self.attr('height', _self[0]._dialogHeight);
                    _destroyLayer();
                    dialogObj.dialog.remove();
                    dialogObj.dialog = undefined;
                    _self[0]._dialogTitle = undefined;
                    _self[0]._dialogWidth = undefined;
                    _self[0]._dialogHeight = undefined;
                    _self[0]._cloudjsDialogObj = undefined;
                    dialogObj = null;
                },
                fullscreen: function(){//全屏
                    dialogObj.draggable(false);
                    dialogObj.resizable(false);
                    dialogObj.onFullscreen.call(dialogObj);
                    _fullscreen(dialog);
                    backScreenBtn.show();
                    fullscreenBtn.hide();
                    dialogObj._fullscreen = true;
                },
                backscreen: function(){//还原
                    if($(dialogObj._defaults.relative).length === 0){
                        dialogObj.draggable(dialogObj._defaults.draggable);
                        dialogObj.resizable(dialogObj._defaults.resizable);
                    }
                    dialogObj.onRecover.call(dialogObj);
                    _backscreen(dialog);
                    dialogObj._defaults.fullscreen && fullscreenBtn.show();
                    backScreenBtn.hide();
                    dialogObj._fullscreen = false;
                },
                draggable: function(enable){//设置拖动
                    if(enable){
                        _bindDraggable(dialog, head, _dragBinded, dialogObj.onDragStart, dialogObj.onDragStop, dialogObj.onDrag);
                        (!_dragBinded) && (_dragBinded = true);
                    }else if(_dragBinded){
                        cloudjs(dialog).draggable('disable');
                        head.css({ cursor: 'default' });
                    }
                },
                resizable: function(enable){//设置缩放
                    if(enable){
                        if(!_resizeBinded){
                            cloudjs(dialog).resizable({
                                start: dialogObj.onResizeStart,
                                stop: dialogObj.onResizeStop,
                                resize: dialogObj.onResize,
                                minHeight: _minHeight,
                                minWidth: _minWidth
                            });
                        }else{
                            cloudjs(dialog).resizable('enable');
                        }
                        _resizeBinded = true;
                    }else{
                        if(_resizeBinded){
                            cloudjs(dialog).resizable('disable');
                        }
                    }
                },
                setTitle: function(title){//设置标题
                    dialogObj.onTitleChange(headTitle.html(), title);
                    headTitle.html(title);

                },
                setContent: function(content){//设置内容
                    dialogObj.onContentChange(body.html(), content);
                    body.html(content);
                },
                setButtons: function(buttons){//设置按钮
                    foot.html('');
                    buttons = buttons||{};
                    for(var p in buttons){
                        _addButton(p, buttons[p], foot);
                    }
                },
                setWidth: function(width){//设置宽度
                    dialog.width(width);
                    _lastWidth = width;
                },
                setHeight: function(height){//设置高度
                    dialog.height(height);
                    _lastHeight = height;
                },
                setModal: function(show){//设置模态窗口
                    show ? _showLayer() : _hideLayer();
                },
                setPosition: function(relative, draggable, position, isInit){//设置位置
                    relative=$(relative);
                    if(relative.length){
                        _relativePosiiton(dialog, relative, position, dialogObj._defaults.fullscreen, isInit);
                    }else{
                        _middlePosition(dialog, dialogObj._defaults.fullscreen, isInit);
                    }
                    _lastStatus();
                },
                onCreate: function(){
                    dialogObj._defaults.onCreate.apply(dialogObj, arguments);
                },
                onOpen: function(){
                    dialogObj._defaults.onOpen.apply(dialogObj, arguments);
                },
                onClose: function(){
                    dialogObj._defaults.onClose.apply(dialogObj, arguments);
                },
                onDestroy: function(){
                    dialogObj._defaults.onDestroy.apply(dialogObj, arguments);
                },
                onResizeStart: function(){
                    dialogObj._defaults.onResizeStart.apply(dialogObj, arguments);
                },
                onResize: function(){
                    if(!dialogObj._defaults.draggable){
                        _middlePosition(dialog, dialogObj._defaults.fullscreen);
                    }
                    dialogObj.onSizeChange();
                    dialogObj._defaults.onResize.apply(dialogObj, arguments);
                },
                onResizeStop: function(event, ui){
                    dialogObj._defaults.onResizeStop.apply(dialogObj, arguments);
                },
                onDragStart: function(){
                    dialogObj._defaults.onDragStart.apply(dialogObj, arguments);
                },
                onDrag: function(){
                    dialogObj._defaults.onDrag.apply(dialogObj, arguments);
                },
                onDragStop: function(event, ui){
                    dialogObj._defaults.onDragStop.apply(dialogObj, arguments);
                },
                onFullscreen: function(){
                    dialogObj._defaults.onFullscreen.apply(dialogObj, arguments);
                },
                onRecover: function(){
                    dialogObj._defaults.onRecover.apply(dialogObj, arguments);
                },
                onTitleChange: function(oldTitle, newTitle){
                    dialogObj._defaults.onTitleChange.apply(dialogObj, arguments);
                },
                onContentChange: function(oldContent, newContent){
                    dialogObj._defaults.onContentChange.apply(dialogObj, arguments);
                },
                onSizeChange: function(){
                    body.height(dialog.height() - head.outerHeight() - foot.outerHeight() - _boxSpace(body).v);
                },
                addButton: function(button){
                    _addButton(button.name, button.handler, foot, button.index);
                },
                removeButton: function(name){
                    if(_dialogBtns[name]){
                        _dialogBtns[name].remove();
                        _dialogBtns[name] = undefined;
                    }
                },
                disableButton: function(name){
                    if(_dialogBtns[name]){
                        _dialogBtns[name].addClass('cloud_btn_disable');
                    }
                },
                enableButton: function(name){
                    if(_dialogBtns[name]){
                        _dialogBtns[name].removeClass('cloud_btn_disable');
                    }
                },
                hideButton: function(name){
                    _dialogBtns[name] && _dialogBtns[name].hide();
                },
                showButton: function(name){
                    _dialogBtns[name] && _dialogBtns[name].show();
                }
            };

            $(window).resize(function(){
                if(dialogObj && !dialogObj._fullscreen){
                    if(!dialogObj._defaults.draggable){
                        _middlePosition(dialog, dialogObj._defaults.fullscreen);
                    }
                    if($(dialogObj._defaults.relative).length){
                        _relativePosiiton(dialog, $(dialogObj._defaults.relative), dialogObj._defaults.position, dialogObj._defaults.fullscreen);
                    }
                }
            });

            dialog.mousedown(function(){
                if(dialog.css('zIndex') < cloudjs._dialogZindex){
                    dialog.css('zIndex', cloudjs._dialogZindex += 2);
                }
            });

            dialogObj.onCreate();
            closeBtn.click($.proxy(dialogObj.close, dialogObj));
            fullscreenBtn.click(dialogObj.fullscreen);
            backScreenBtn.click(dialogObj.backscreen);

            return dialogObj;
        }

        /**
         * 将页面的overflow设置为不可滚动
         * @param {String|Object} ele 设置fixed模式的元素
         */
        function _fixed(ele){
            ele.css({position: 'fixed', left: '0px', top: '0px'});
            $('body').css('overflow', 'hidden');
        }

        /**
         * 将页面的overflow设置为初始值
         * @param {String|Object} ele 设置非fixed模式的元素
         */
        function _unfixed(ele){
            $('body').css({ overflowX: _dialogObj._bodyOverX, overflowY: _dialogObj._bodyOverY });
            ele.css({ position: 'absolute', left: _lastLeft, top: _lastTop });
        }

        /**
         * 记住最近一次的dialog的状态
         */
        function _lastStatus(){
            _lastLeft = _dialogObj.dialog.offset().left;
            _lastTop = _dialogObj.dialog.offset().top;
            _lastWidth = _dialogObj._defaults.width = _dialogObj.dialog.width();
            _lastHeight = _dialogObj._defaults.height = _dialogObj.dialog.height();
        }

        /**
         * 绑定拖动功能
         * @param {String|Object} ele 拖动的对象
         * @param {String|Object} handle 拖动的手把
         * @param {Boolean} binded 是否绑定过
         * @param {Function} onDragStart 拖动时触发的事件
         * @param {Function} onDragStop 停止拖动时触发的事件
         * @param {Function} onDrag 拖动过程触发的事件
         */
        function _bindDraggable(ele, handle, binded, onDragStart, onDragStop, onDrag){
            if(!binded){
                cloudjs(ele).draggable({ handle: handle, opacity: 1, start: onDragStart, stop: onDragStop, drag: onDrag });
            }else{
                cloudjs(ele).draggable('enable');
            }
            handle.css({ cursor: 'move' });
        }

        /**
         * 计算盒子模型的边距
         * @param {String|Object} ele 目标元素
         * @return {Object} 返回盒子模型的边距
         */
        function _boxSpace(ele){
            ele = $(ele);
            return {
                v: _deal(ele.css('marginTop')) + _deal(ele.css('marginBottom')) + _deal(ele.css('paddingTop')) + _deal(ele.css('paddingBottom')),
                h: _deal(ele.css('marginLeft')) + _deal(ele.css('marginRight')) + _deal(ele.css('paddingLeft')) + _deal(ele.css('paddingRight'))
            };
        }

        /**
         * 将auto转换为0
         * @param {String} space 值
         * @return {Number} 返回具体的大小
         */
        function _deal(space){
            return space === 'auto' ? 0 : parseInt(space);
        }

        /**
         * 添加按钮
         * @param {String} name 按钮名称
         * @param {Function} handler 按钮触发的事件
         * @param {String|Object} container 按钮的容器
         * @param {Number} index 添加到的位置
         */
        function _addButton(name, handler, container, index){
            var btn = '';
            if(_dialogBtns[name]){
                _dialogObj.removeButton(name);
            }
            btn += '<span class="dialog_div_foot_button cloud_btn">';
            btn += name;
            btn += '</span>';
            if(isNaN(index) || !container.find('.dialog_div_foot_button').length){
                btn = $(btn).appendTo(container);
            }else{
                btn = $(btn).insertBefore(container.find('.dialog_div_foot_button').eq(index));
            }
            btn.bind('click.'+name, function(){
                if(!_dialogBtns[name].hasClass('cloud_btn_disable')){
                    handler.call(_dialogObj);
                }
            });
            _dialogBtns[name] = btn;
        }

        /**
         * 全屏功能
         * @param {String|Object} ele 目标元素
         * @param {Function} callback 全屏完成时调用的回调方法
         */
        function _fullscreen(ele, callback){
            var scrollTop = $(window).scrollTop(), scrollLeft = $(window).scrollLeft();
            _lastStatus();
            ele = $(ele);
            cloudjs._dialogAnimating = true;
            ele.animate({ left: scrollLeft + 'px', top: scrollTop + 'px', height: '100%', width: '100%', borderWidth: '0px' }, 300, function(){
                cloudjs._dialogAnimating = false;
                _dialogObj.onResize();
                _fixed(ele);
                callback && callback();
            });
        }

        /**
         * 全屏还原功能
         * @param {String|Object} ele 目标元素
         * @param {Function} callback 全屏还原完成时调用的回调方法
         */
        function _backscreen(ele, callback){
            var scrollTop = $(window).scrollTop(), scrollLeft = $(window).scrollLeft(), top, left;
            ele = $(ele);
            $('body').css({overflowX: _dialogObj._bodyOverX, overflowY: _dialogObj._bodyOverY});
            left = _lastLeft - scrollLeft;
            top = _lastTop - scrollTop;

            cloudjs._dialogAnimating = true;
            ele.animate({ left:left, top: top, height: _lastHeight, width: _lastWidth, borderWidth: '1px'}, 300, function(){
                cloudjs._dialogAnimating = false;
                _dialogObj.onResize();
                _unfixed(ele);
                callback && callback();
            });
        }

        /**
         * 显示页面遮层，模态窗口模式时调用
         */
        function _showLayer(){
            var layer = _dialogObj._layer;
            if(!layer){
                _dialogObj._layer = layer = $('<div class="dialog_div_layer"></div>').appendTo('body');
                layer.css('zIndex', cloudjs._dialogZindex - 1);
            }
            layer.show();
        }

        /**
         * 关闭页面遮层
         */
        function _hideLayer(){
            var layer = _dialogObj._layer;
            if(layer){
                layer.hide();
            }
        }

        /**
         * 彻底销毁页面遮层
         */
        function _destroyLayer(){
            var layer = _dialogObj._layer;
            if(layer){
                layer.remove();
                _dialogObj._layer = undefined;
            }
        }

        /**
         * 计算适合的方位，如果传入的默认方位经计算不合适，会重新选择合适的方位
         * @param {String|Object} ele 目标元素
         * @param {Object} relativeObj 相对的元素
         * @param {String} position 默认的方位
         * @return {Object} 返回合适的方位
         */
        function _calculatePosition(ele, relativeObj, position){
            var positions,
                scrollTop,
                scrollLeft,
                screenWidth,
                screenHeight,
                eleTop,
                eleWidth,
                eleHeight,
                relativeObjWidth,
                relativeObjHeight,
                relativeObjTop,
                relativeObjLeft,
                _position;

            if(position !== ARROW_DOWN 
            		&& position !== ARROW_UP 
            		&& position !== ARROW_RIGHT 
            		&& position !== ARROW_LEFT
            		&& position !== ARROW_UP_LEFT
            		&& position !== ARROW_UP_RIGHT
            		&& position !== ARROW_DOWN_LEFT
            		&& position !== ARROW_DOWN_RIGHT){
                position = undefined;
            }

            scrollTop = $(window).scrollTop();
            scrollLeft = $(window).scrollLeft();
            screenWidth = $(window).width();
            screenHeight = $(window).height();
            relativeObjLeft = relativeObj.offset().left - scrollLeft;
            relativeObjTop = relativeObj.offset().top - scrollTop;
            eleWidth = ele.outerWidth();
            eleHeight = ele.outerHeight();
            relativeObjWidth = relativeObj.outerWidth();
            relativeObjHeight = relativeObj.outerHeight();

            positions = {};

            positions[ARROW_UP] = function(){
                return _uu() && _lr();
            };

            positions[ARROW_DOWN] = function(){
                return _dd() && _lr();
            };

            positions[ARROW_LEFT] = function(){
                return _ll() && _ud();
            };

            positions[ARROW_RIGHT] = function(){
                return _rr() && _ud();
            };

            positions[ARROW_UP_LEFT] = function(){
                return _uu() && _cl();
            };

            positions[ARROW_UP_RIGHT] = function(){
                return _uu() && _cr();
            };

            positions[ARROW_DOWN_LEFT] = function(){
                return _dd() && _cl();
            };

            positions[ARROW_DOWN_RIGHT] = function(){
                return _dd() && _cr();
            };

            //下面是一些计算位置的内部方法

            function _lr(){
                return (relativeObjLeft + relativeObjWidth / 2 - eleWidth / 2 > 0) && (relativeObjLeft + eleWidth / 2 + relativeObjWidth / 2 < screenWidth);
            }

            function _ud(){
                return (relativeObjTop + relativeObjHeight / 2 - eleHeight / 2 > 0) && (relativeObjTop + eleHeight / 2 + relativeObjHeight / 2 < screenHeight);
            }

            function _cl(){
                return relativeObjLeft + relativeObjWidth / 2 - eleWidth + ARROW_WIDTH > 0;
            }

            function _cr(){
                return relativeObjLeft + relativeObjWidth / 2 + eleWidth - ARROW_WIDTH < screenWidth;
            }

            function _uu(){
                return relativeObjTop - eleHeight - ARROW_WIDTH - SPACING > 0;
            }

            function _dd(){
                return relativeObjTop + eleHeight + relativeObjHeight + ARROW_WIDTH + SPACING < screenHeight;
            }

            function _ll(){
                return relativeObjLeft - eleWidth - ARROW_WIDTH - SPACING > 0;
            }

            function _rr(){
                return relativeObjLeft + relativeObjWidth + eleWidth + ARROW_WIDTH + SPACING < screenWidth;
            }

            if(position && positions[position]()){
                _position = position;
            }

            if(!_position){
                for(var p in positions){
                    if(positions[p]()){
                        _position = p;
                        break;
                    }
                }
            }

            _position = _position || ARROW_DOWN;

            return _position;
        }

        /**
         * 根据方位计算位置坐标
         * @param {String|Object} ele 目标元素
         * @param {Object} relativeObj 相对的元素
         * @param {String} position 显示的方位
         * @return {Object} 返回位置坐标值
         */
        function _getOffset(ele, relativeObj, position){
            var offset = {},
                eleWidth = ele.outerWidth(),
                eleHeight = ele.outerHeight(),
                relativeObjWidth = relativeObj.outerWidth(),
                relativeObjHeight = relativeObj.outerHeight();

            switch(position){
                case ARROW_LEFT:
                    offset.left = relativeObj.offset().left - eleWidth - ARROW_WIDTH - SPACING;
                    offset.top = relativeObj.offset().top + relativeObjHeight / 2 - eleHeight / 2;
                    break;
                case ARROW_RIGHT:
                    offset.left = relativeObj.offset().left + relativeObjWidth + ARROW_WIDTH + SPACING;
                    offset.top = relativeObj.offset().top + relativeObjHeight / 2 - eleHeight / 2;
                    break;
                case ARROW_UP:
                    offset.left = relativeObj.offset().left + relativeObjWidth / 2 - eleWidth / 2;
                    offset.top = relativeObj.offset().top - eleHeight - ARROW_WIDTH - SPACING;
                    break;
                case ARROW_DOWN:
                    offset.left = relativeObj.offset().left + relativeObjWidth / 2 - eleWidth / 2;
                    offset.top = relativeObj.offset().top + relativeObjHeight + ARROW_WIDTH + SPACING;
                    break;
                case ARROW_UP_LEFT:
                    offset.left = relativeObj.offset().left + relativeObjWidth / 2 - eleWidth + ARROW_WIDTH + LEFT_EDG;
                    offset.top = relativeObj.offset().top - eleHeight - ARROW_WIDTH - SPACING;
                    break;
                case ARROW_UP_RIGHT:
                    offset.left = relativeObj.offset().left + relativeObjWidth / 2 - ARROW_WIDTH - RIGHT_EDG;
                    offset.top = relativeObj.offset().top - eleHeight - ARROW_WIDTH - SPACING;
                    break;
                case ARROW_DOWN_LEFT:
                    offset.left = relativeObj.offset().left + relativeObjWidth / 2 - eleWidth + ARROW_WIDTH + LEFT_EDG;
                    offset.top = relativeObj.offset().top + relativeObjHeight + ARROW_WIDTH + SPACING;
                    break;
                case ARROW_DOWN_RIGHT:
                    offset.left = relativeObj.offset().left + relativeObjWidth / 2 - ARROW_WIDTH - RIGHT_EDG;
                    offset.top = relativeObj.offset().top + relativeObjHeight + ARROW_WIDTH + SPACING;
                    break;
                default:
                    //不会到这里
            }

            return offset;
        }

        /**
         * 动画效果打开弹出框
         * @param {Function} callback 回调方法
         */
        function _animateOpen(callback){
            var arrow, dialog, fromX, fromY, fromW = 0, fromH = 0, toX, toY, toW, toH, dialogOffset, arrowOffset;
            dialog = _dialogObj.dialog;
            arrow = dialog.find('.'+DIALOG_ARROW);

            arrowOffset = arrow.offset();
            dialogOffset = dialog.offset();

            if(arrow.length){
                fromX = arrowOffset.left;
                fromY = arrowOffset.top;
            }else{
                fromX = dialogOffset.left + dialog.width()/2;
                fromY = dialogOffset.top + dialog.height()/2;
            }

            toX = dialogOffset.left;
            toY = dialogOffset.top;
            toW = dialog.width();
            toH = dialog.height();

            (!$.easing.easeOutBack) && $.extend(
                $.easing,
                {   //借用ease的动画算法，压缩的代码，别介意
                    easeOutBack: function(e, f, a, i, h, g){if(g == undefined){g = 1.70158} return i * ((f = f / h - 1) * f * ((g + 1) * f + g) + 1) + a;} 
                },
                true
            );

            dialog.css({ left: fromX, top: fromY, width: fromW, height: fromH });

            cloudjs._dialogAnimating = true;
            dialog.animate({ left: toX, top: toY, width: toW, height: toH}, {duration: 300, easing: 'easeOutBack', complete: function(){
                cloudjs._dialogAnimating = false;
                callback();
            }}); //更多效果 easeOutElastic  easeInOutElastic  easeOutBack  easeInOutBack  easeOutBounce
        }

        /**
         * 相对元素的打开方式
         * @param {String|Object} ele 目标元素
         * @param {Object} relativeObj 相对元素
         * @param {String} position 打开的方位
         * @param {Boolean} fullscreen 是否允许全屏
         * @param {Boolean} isInit 是否初始化
         */
        function _relativePosiiton(ele, relativeObj, position, fullscreen, isInit){
            var arrow, offset;
            ele = $(ele);
            arrow = ele.find('.' + DIALOG_ARROW).show();
            _setFullscreenBtnVisible(ele, fullscreen, isInit);

            if(!arrow.length){
                arrow = $('<span class="' + DIALOG_ARROW + '"><i></i></span>').appendTo(ele);
            }

            position = _calculatePosition(ele, relativeObj, position);
            offset = _getOffset(ele, relativeObj, position);

            arrow.removeClass().addClass(DIALOG_ARROW + ' ' + DIALOG_ARROW + '_' + position);
            ele.css({
                left: offset.left + 'px',
                top: offset.top + 'px'
            });
        }

        /***
         * 获取一个元素在页面中的绝对居中位置
         * @param {String|Object} ele 需要居中的目标元素
         * @param {Boolean} fullscreen 是否允许全屏
         * @param {Boolean} isInit 是否初始化
         */
        function _middlePosition(ele, fullscreen, isInit){
            var offset;

            ele = $(ele);
            ele.find('.' + DIALOG_ARROW).hide();

            _setFullscreenBtnVisible(ele, fullscreen, isInit);

            offset =  _getMiddleOffset(ele);

            ele.css({ left: offset.left, top: offset.top });
        }

        /**
         * 根据方位计算位置坐标
         * @param {String|Object} ele 目标元素
         * @param {Boolean} fullscreen 是否允许全屏
         * @param {Boolean} isInit 是否初始化
         */
        function _setFullscreenBtnVisible(ele, fullscreen, isInit){
            if(isInit){
                ele.find('.dialog_div_head_backscreen_btn').hide();
            }
            if(!ele.find('.dialog_div_head_backscreen_btn').is(':visible')){
                fullscreen && ele.find('.dialog_div_head_fullscreen_btn').show();
            }
            if(!fullscreen){
                ele.find('.dialog_div_head_fullscreen_btn').hide();
            }
        }

        /**
         * 根据方位计算位置坐标
         * @param {String|Object} ele 目标元素
         * @return {Object} 返回位置坐标值
         */
        function _getMiddleOffset(ele){
            var winWidth, winHeight, eleWidth, eleHeight, left, top,
                scrollTop = $(window).scrollTop(), scrollLeft = $(window).scrollLeft();

            ele = $(ele);
            winWidth = parseInt($(window).width());
            winHeight = parseInt($(window).height());
            eleWidth = parseInt(ele.outerWidth());
            eleHeight = parseInt(ele.outerHeight());
            left = parseInt(winWidth / 2 - eleWidth / 2) + scrollLeft + 'px';
            top = parseInt(winHeight / 3 - eleHeight / 3) + scrollTop + 'px';

            return { left: left, top: top };
        }
    },
    require: ['../css/blue/dialog.css']
});