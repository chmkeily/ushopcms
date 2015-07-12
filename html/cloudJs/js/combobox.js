cloudjs.define({
    combobox: function(options){
        var defaults = {
            isMulti: false,    //是否多选
            width: null,    //下拉列表宽度
            height: 200,    //下拉列表高度
            separate: ';',    //下拉数据分隔符
            defaultKey: '',    //默认选中选项
            checkKey: false,    //是否检查key值必须是data里面的key
            showIcon: true,
            showAll: true,    //是否显示全部下拉
            recordLen: 10,    //搜索时最多显示的记录数
            name: '',    //key隐藏域
            zIndex: 600,    //下拉列表的z-index值
            data: null,    //data数据
            comkey: 'key',    //key字段名
            comvalue: 'value',    //value字段名
            checkAllText: '全选',    //全选文字
            unCheckAllText: '取消全选',    //全选文字
            showCheckAllText: true,    //是否显示全选文字
            url: '',    //异步下拉数据url
            params: '',    //异步搜索下拉数据参数
            onOpen: $.noop,
            onClose: $.noop,
            onSelect: $.noop,
            onCheckAll: $.noop,
            onUnCkeckAll: $.noop
        };

        if($(this).length === 0){
            cloudjs.util.error('调用combobox下拉组件失败，' + this.selector + ' 找不到相应的元素!');
            return;
        }

        if(!options || $.isPlainObject(options)){
            $.extend(defaults, options);
        }

        var _self = this,
            _isMulti = defaults.isMulti,
            _width = defaults.width,
            _height = defaults.height,
            _separate = defaults.separate,
            _defaultKey = defaults.defaultKey,
            _checkKey = defaults.checkKey,
            _showIcon = defaults.showIcon,
            _showAll = defaults.showAll,
            _recordLen = defaults.recordLen,
            _hideName = defaults.name,
            _zIndex = defaults.zIndex,
            _jsonData = defaults.data,
            _comkey = defaults.comkey,
            _comvalue = defaults.comvalue,
            _checkAllText = defaults.checkAllText,
            _unCheckAllText = defaults.unCheckAllText,
            _showCheckAllText = defaults.showCheckAllText,
            _url = defaults.url,
            _params = defaults.params,
            _isCheckAll = false,
            _comboEle = null,
            _showEle = null,    //显示value的表单元素
            _hideEle = null,    //显示key的隐藏表单元素
            _panelEle = null,    //下拉面板元素
            _isFirst = true,
            _isSelectTag = false,
            _defaultValue = '',
            _strData = '',    //数据字符串
            _ajaxIng = false,
            _searchTimeout = null,
            _comboObj = null,
            _args0,
            _args1;


        if(typeof options === 'string'){
            _comboObj = $(_self)[0]._cloudjsComboObj;
            _args0 = options;
            _args1 = arguments[1];

            if(_args0 === 'getValue'){
                cloudjs.callback(_comboObj[_args0]());
            }else{
                _comboObj && _comboObj[_args0](_args1);// && _comboObj[_args0].call(this);
            }

            return;
        }
        
        _init();

        /**
         * 初始化
         */
        function _init(){
            var keyArr, optionEles;

            if($(_self).hasClass('combo_text') && $(_self).parent().hasClass('combo_container')){
                $(_self).siblings().remove();
            }else{
                if($(_self).prop('disabled')){
                    $(_self).wrap('<span class="combo_container combo_disabled"></span>');
                }else{
                    $(_self).wrap('<span class="combo_container"></span>');
                }
            }

            if($(_self)[0].tagName.toLowerCase() === 'select'){
                _isSelectTag = true;
                $(_self).hide();
                $(_self).parent().append('<input type="text" class="combo_text" />');

                _showEle = $(_self).siblings('.combo_text');

                if(!_jsonData){ //如果设置了data，以设置的data为准
                    _jsonData = [];
                    optionEles = $(_self).find('option');
                    for (var i = 0; i < optionEles.length; i++) {
                        _jsonData[i] = {};
                        _jsonData[i][_comkey] = optionEles.eq(i).attr('value');
                        _jsonData[i][_comvalue] = optionEles.eq(i).text();
                        _jsonData[i]['disabled'] = optionEles.eq(i).prop('disabled') ? 'true' : '';
                    }
                }else{
                    _isMulti = _isMulti || $(_self).prop('multiple');
                }
            }else{
                !$(_self).hasClass('combo_text') && $(_self).addClass('combo_text');

                _showEle = $(_self);
            }
            _comboEle = _showEle.parent();

            if(_showIcon){
                $(_self).parent().append('<input type="hidden" class="combo_value" name="' + _hideName + '" /><span class="combo_arrow"><span></span></span>');
            }else{
                $(_self).parent().append('<input type="hidden" class="combo_value" name="' + _hideName + '" />');
            }
            _hideEle = $(_self).siblings('.combo_value');

            _setDefaultValue(_defaultKey);    //设置默认值对应的value

            _bindEvent();

            _comboObj = _comboObj || _getComboObj();
            $(_self)[0]._cloudjsComboObj = _comboObj;
        }

        /**
         * 设置默认值
         */
        function _setDefaultValue(){
            if(_defaultKey){
                if(_jsonData){
                    if(_isMulti){
                        _defaultValue = _getMultiValue(_jsonData, _defaultKey);
                    }else{
                        if($.isArray(_jsonData)){
                            for(var i = 0; i < _jsonData.length; i ++){
                                if(_defaultKey === _jsonData[i][_comkey]){
                                    _defaultValue = _jsonData[i][_comvalue];
                                }
                            }
                        }else if($.isPlainObject(_jsonData)){
                            _defaultValue = _jsonData[_defaultKey];
                        }
                    }
                    _defaultKey = _checkKey && _defaultValue === '' ? '' : _defaultKey;

                    _showEle.val(_defaultValue);
                    _hideEle.val(_defaultKey);

                    return;
                }

                if(_url){
                    _comboEle.addClass('combo_disabled');
                    _getAjaxData(_setDefaultValue);
                }
            }else{
                _hideEle.val('');
            }
        }

        /**
         * 获取默认key对于的value [多选的时候]
         * @param  {Json/Array}  data 数据
         * @param  {String} key  key字符串
         * @return {String}      返回key对应的value字符串
         */
        function _getMultiValue(data, key){
            var keyArr = key.split(_separate),
                valueStr = '';

            _defaultKey = '';

            if($.isArray(data)){
                for(var i = 0; i < data.length; i ++){
                    for(var j = 0; j < keyArr.length; j ++){
                        if((_separate + _defaultKey).indexOf(_separate + keyArr[j] + _separate) === -1 && keyArr[j] === data[i][_comkey]){
                            _defaultKey += data[i][_comkey] + _separate;
                            valueStr += data[i][_comvalue] + _separate;
                        }
                    }
                }
            }else if($.isPlainObject(data)){
                for(var k = 0; k < keyArr.length; k ++){
                    if(data[keyArr[k]]){
                        valueStr += data[keyArr[k]] + _separate;
                    }
                }
            }
            return valueStr;
        }

        /**
         * 通过ajax获取数据
         * @param  {Function} callback 回调函数
         */
        function _getAjaxData(callback){
            _ajaxIng = true;

            $.ajax({
                url: _url,
                dataType: 'json',
                success: function(data){
                    _ajaxIng = false;
                    _jsonData = data;
                    _comboEle.removeClass('combo_disabled');
                    callback();
                }
            });
        }

        /**
         * 改变下拉列表的值
         * @param  {Object} ele 当前操作的下拉元素
         * @param  {String} targetName 当前操作元素名称
         */
        function _changeSelect(ele, targetName){
            ele = ele || _panelEle.find('.combo_item_hover');
            targetName = targetName || '';

            if(targetName !== 'input'){
                if($(ele).find('.combo_check').prop('checked')){
                    $(ele).find('.combo_check').prop('checked', false);
                }else{
                    $(ele).find('.combo_check').prop('checked', true);
                }
            }else{
                ele = $(ele).parent();
            }

            // if($(ele).hasClass('check_all')){
            //     _isCheckAll = $(ele).find('.combo_check').prop('checked');    //记录全选操作
            //     _panelEle.find('.combo_item').not('.check_all').each(function(){
            //         $(this).find('.combo_check').prop('checked', $(ele).find('.combo_check').prop('checked'));
            //         _changeSelect($(this).find('.combo_check'), 'input');
            //     });

            //     return;
            // }

            var lastKey = $.trim(_hideEle.val()),
                lastValue = $.trim(_showEle.val()),
                curKey = $(ele).attr('combo-key'),
                value = $(ele).text(),
                lastSeparate;

            if(!_isMulti){
                _panelEle.hide();
                _comboObj.close();
            }else{
                _showEle.blur();
                if($(ele).find('.combo_check').prop('checked')){
                    if((_separate + lastKey).indexOf(_separate + curKey + _separate, _separate) === -1){
                        curKey = lastKey + curKey + _separate;
                        value = lastValue + value + _separate;
                    }else{
                        curKey = lastKey;
                        value = lastValue;
                    }
                }else{
                    curKey = (_separate + lastKey).replace(_separate + curKey + _separate, _separate).replace(_separate, '');
                    value = (_separate + lastValue).replace(_separate + value + _separate, _separate).replace(_separate, '');
                }
            }

            _showEle.val(value);
            _hideEle.val(curKey);
            if(lastKey !== curKey){    //key值真正改变才触发onSelect
                _comboObj.select(curKey);
            }
        }

        /**
         * 阻止事件冒泡
         * @param  {Object} e 当前事件对象
         */
        function _stopBubble(e){
            if(window.ActiveXObject){
                if(window.event){
                    window.event.cancelBubble = true;
                }
            }else{
                e.stopPropagation();
            }
        }

        /**
         * 获取数据，并生成下拉html
         * @param  {Object} 下拉数据
         */
        function _formatDataToHtml(data, isSearch){
            var panelHtml = '',
                key,
                value,
                disabledClass = '',
                checkedStr = '',
                dataLen = 0;

            if(_isMulti && !isSearch && _showCheckAllText){
                panelHtml += '<div class="combo_head"><span class="combo_check_all ' + (!_isCheckAll ? '' : 'combo_uncheck_all') + '">' + (!_isCheckAll ? _checkAllText : _unCheckAllText) + '</span><span class="combo_close_btn cloud_icon"></span></div>';
            }
            if($.isArray(data)){
                for (var i = 0; i < data.length; i++) {
                    key = data[i][_comkey];
                    value = data[i][_comvalue];
                    disabledClass = data[i]['disabled'] ? 'combo_item_disabled' : '';    //可以在数据里加disabled属性

                    if(_isFirst){
                        _strData += encodeURIComponent(value) + '#' + encodeURIComponent(key) + ',';
                    }

                    if(!(!_showAll && i >= _recordLen)){
                        if(_isMulti){
                            checkedStr = (_separate + $.trim(_showEle.val())).indexOf(_separate + value + _separate) !== -1 ? 'checked="checked"' : '';
                            panelHtml += '<div class="combo_item ' + disabledClass + '" combo-key="' + key + '"><input type="checkbox" class="combo_check" ' + checkedStr + ' />' + value + '</div>';
                        }else{
                            panelHtml += '<div class="combo_item ' + disabledClass + '" combo-key="' + key + '">' + value + '</div>';
                        }
                    }
                }
            }else if($.isPlainObject(data)){
                for (var property in data) {
                    key = property;
                    value = data[property];

                    if(_isFirst){
                        _strData += encodeURIComponent(value) + '#' + encodeURIComponent(key) + ',';
                    }

                    if(!(!_showAll && dataLen >= _recordLen)){
                        if(_isMulti){
                            checkedStr = (_separate + $.trim(_showEle.val())).indexOf(_separate + value + _separate) !== -1 ? 'checked="checked"' : '';
                            panelHtml += '<div class="combo_item" combo-key="' + key + '"><input type="checkbox" class="combo_check" ' + checkedStr + ' />' + value + '</div>';
                        }else{
                            panelHtml += '<div class="combo_item" combo-key="' + key + '">' + value + '</div>';
                        }
                    }

                    dataLen ++;
                }
            }

            return panelHtml;
        }

        /**
         * 创建下拉列表面板
         */
        function _createComboPamel(){
            _width = _width || _comboEle.innerWidth();

            var top = _comboEle.outerHeight() - parseInt(_comboEle.css('border-bottom-width'), 10) - parseInt(_comboEle.css('border-top-width'), 10),
                left = parseInt(_comboEle.css('border-left-width'), 10);

            _panelEle = $('<div></div>').addClass('combo_panel').css({'z-index': _zIndex, 'width': _width, 'max-height': _height, 'top': top, 'left': -left});

            _comboEle.append(_panelEle);
        }


        /**
         * 初始化下拉面板
         * @param  {Object} data 下拉面板数据
         * @param  {String} data 是否搜索
         */
        function _initSearchPanel(data, isSearch){
            //$('html').click(); //隐藏其他的下拉列表
            var isHidden;

            data = data || _jsonData;
            if(_comboEle.hasClass('combo_disabled') || _showEle.prop('disabled')){
                return;
            }

            if(_isFirst){
                _createComboPamel();
            }
            isHidden = _panelEle.is(':hidden').length;
            
            if(data){
                _panelEle.show().html(_formatDataToHtml(data, isSearch)).unbind('click').bind('click', function(e){
                    e = e || window.event;

                    var target =  e.target || e.srcElement,
                        curEle;

                    if($(target).hasClass('combo_item') || (target.tagName.toLowerCase() === 'input' && _isMulti)){
                        _changeSelect(target, target.tagName.toLowerCase());
                    }

                    _stopBubble(e);
                }).find('.combo_head').bind('mouseenter', function(e) {
                    _panelEle.find('.combo_item').removeClass('combo_item_hover');
                }).find('.combo_check_all').unbind().bind('click', function(){  //全选、取消全选
                    if($(this).hasClass('combo_uncheck_all')){
                        $(this).removeClass('combo_uncheck_all').html(_checkAllText);
                        _isCheckAll = false;
                    }else{
                        $(this).addClass('combo_uncheck_all').html(_unCheckAllText);
                        _isCheckAll = true;
                    }
                    _panelEle.find('.combo_item').each(function(){
                        $(this).find('.combo_check').prop('checked', _isCheckAll);
                        _changeSelect($(this).find('.combo_check'), 'input');
                    });
                }).find('.combo_close_btn').unbind().bind('click', function(){
                    _panelEle.hide();
                });
                isHidden && _comboObj.open();

                _isFirst = false;
                return;    //如果有本地数据，则即使有url，也不会去请求
            }

            if(_url){
                _panelEle.show().html('Loading...');
                isHidden && _comboObj.open();

                _getAjaxData(_initSearchPanel);

                _isFirst = false;
            }
        }


        /**
         * 创建combobox对象和其操作方法
         * @return {Object} 返回创建好的对象
         */
        function _getComboObj(){
            var comboObj = {
                defaults: defaults,
                showEle: _showEle,
                hideEle: _hideEle,
                comboEle: _comboEle,
                open: function(){
                    this.defaults.onOpen.apply(this, arguments);
                },
                close: function(){
                    this.defaults.onClose.apply(this, arguments);
                },
                checkAll: function(){
                    this.defaults.onClose.apply(this, arguments);
                },
                unCheckAll: function(){
                    this.defaults.onClose.apply(this, arguments);
                },
                select: function(key){
                    this.defaults.onSelect.apply(this, arguments);

                    if(_isSelectTag){
                        if(_isMulti){
                            var keyArr = key.split(_separate);
                            $(_self).prop('multiple', true).find('option').each(function(){
                                if(!this.disabled){
                                    $(this).prop('selected', $.inArray(this.value, keyArr) > -1);
                                }
                            });
                        }else{
                            $(_self).prop('multiple', false).find('option:[value="' + key + '"]').prop('selected', true);
                        }
                        $(_self).change();
                    }
                },
                getValue: function(){
                    var data = {};
                    data[this.defaults.comkey] = $.trim(this.showEle.val());
                    data[this.defaults.comvalue] = $.trim(this.hideEle.val());
                    return data;
                },
                setValue: function(key, check){
                    check = typeof check !== 'undefined' ? check : true;
                    if(typeof key !== 'string'){
                        cloudjs.util.error('设置的key值格式不正式。');
                        return;
                    }

                    var jsonData = this.defaults.data,
                        keyArr = [],
                        value = '',
                        setKeyStr = '';
                        separate = this.defaults.separate;

                    if(this.defaults.isMulti){
                        keyArr = key.split(separate);
                    }

                    if($.isArray(jsonData)){
                        for(var i = 0; i < jsonData.length; i++){
                            if(this.defaults.isMulti){
                                for (var j = 0; j < keyArr.length; j++) {
                                    if(jsonData[i][this.defaults.comkey] === keyArr[j]){
                                        value += jsonData[i][this.defaults.comvalue] + separate;
                                        setKeyStr += keyArr[j] + separate;
                                    }
                                }
                            }else{
                                if(jsonData[i][this.defaults.comkey] === key){
                                    setKeyStr = key;
                                    value = jsonData[i][this.defaults.comkey];
                                }
                            }
                        }
                    }else if($.isPlainObject(jsonData)){
                        if(this.defaults.isMulti){
                            for(var property in jsonData){
                                for (var k = 0; k < keyArr.length; k++) {
                                    if(jsonData[this.defaults.comkey] === keyArr[k]){
                                        value += jsonData[this.defaults.comvalue] + separate;
                                        setKeyStr += keyArr[k] + separate;
                                    }
                                }
                            }
                        }else{
                            if(jsonData[key]){
                                setKeyStr = key;
                                value = jsonData[key];
                            }
                        }
                    }

                    if(setKeyStr || !check){
                        this.showEle.val(value);
                        this.hideEle.val(setKeyStr);
                    }else{
                        cloudjs.util.error('设置的key值不在下拉列表中。');
                    }
                },
                addData: function(data){
                    var jsonData = this.defaults.data,
                        newData;
                    if($.isArray(jsonData) && $.isArray(data)){
                        for (var j = 0; j < data.length; j++) {
                            for(var i = 0; i < jsonData.length; i++){
                                if(jsonData[i][this.defaults.comkey] === data[j][this.defaults.comkey]){
                                    data.splice(j, 1);
                                    j--;
                                }
                            }
                        }

                        _jsonData = jsonData.concat(data);
                        defaults.data = jsonData.concat(data);
                    }else if($.isPlainObject(jsonData) && $.isPlainObject(data)){
                        newData = {};
                        for(var property in data){
                            if(!jsonData[property]){
                                newData[property] = data[property];
                            }
                        }

                        $.extend(_jsonData, newData);
                        $.extend(defaults, newData);
                    }else{
                        cloudjs.util.error('新增数据与初始数据格式不符。');
                    }

                    _isFirst = true;
                },
                delData: function(key){
                    if(typeof key !== 'string'){
                        cloudjs.util.error('删除的key值格式不正式。');
                        return;
                    }

                    var jsonData = this.defaults.data,
                        keyArr = key.split(separate),
                        value = '',
                        separate = this.defaults.separate;

                    if($.isArray(jsonData)){
                        for(var i = 0; i < jsonData.length; i++){
                            for (var j = 0; j < keyArr.length; j++) {
                                if(jsonData[i][this.defaults.comkey] === keyArr[j]){
                                    jsonData.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }else if($.isPlainObject(jsonData)){
                        for(var property in jsonData){
                            for (var k = 0; k < keyArr.length; k++) {
                                if(jsonData[this.defaults.comkey] === keyArr[k]){
                                    delete jsonData[this.defaults.comkey];
                                }
                            }
                        }
                    }

                    this.setValue($.trim(this.hideEle.val()), false);

                    _jsonData = jsonData;
                    defaults.data = jsonData;

                    _isFirst = true;
                },
                disable: function(){
                    this.comboEle.addClass('combo_disabled');
                    this.showEle.prop('disabled', true);
                },
                enable: function(){
                    this.comboEle.removeClass('combo_disabled');
                    this.showEle.prop('disabled', false);
                }
            };

            return comboObj;
        }

        function _bindEvent(){
            $(_self).parent().unbind('click').bind('click', function(e){
                _showEle.focus();

                _stopBubble(e);
            });

            _showEle.unbind().bind('focus', function(e){
                _initSearchPanel();
            }).bind('click', function(e){
                _stopBubble(e);
            }).bind('keyup', function(e){
                if(e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40 || e.keyCode==46 || e.keyCode==13){
                    return;
                }

                var value = $.trim($(this).val()),
                    exg,
                    macthData = null,
                    dataArr = [],
                    lastSeparate;

                if(_isMulti){
                    lastSeparate = value.lastIndexOf(_separate) + 1;
                    value = value.slice(lastSeparate);
                }

                exg = 'var exg = /[^,]*' + encodeURIComponent(value) + '[^,]*#[^,]*/gi',
                eval(exg);

                clearTimeout(_searchTimeout);    //防止输入太快，做了点延迟
                searchFun = function(){
                    if(_strData.toLowerCase().indexOf(encodeURIComponent(value).toLowerCase()) === -1){
                        macthData = [];
                    }else{
                        macthData = _strData.match(exg);
                    }

                    for(var i = 0; i < macthData.length; i ++){
                        dataArr[i] = {};
                        dataArr[i][_comkey] = decodeURIComponent(macthData[i].split('#')[1]);
                        dataArr[i][_comvalue] = decodeURIComponent(macthData[i].split('#')[0]);
                    }
                    
                    _initSearchPanel(dataArr, true);
                };

                _searchTimeout = setTimeout(searchFun, 300);
            }).bind('keydown', function(e){
                var value = $.trim($(this).val()),
                    itemLen = _panelEle.find('.combo_item').length,
                    hoverEle = _panelEle.find('.combo_item_hover'),
                    hoverIndex = hoverEle.length === 0 ? -1 : hoverEle.index();

                if(value.lastIndexOf(_separate) === value.length - 1 && e.keyCode === 8){
                    return false;
                }

                if(!itemLen){
                    return;
                }

                if(e.keyCode === 13){
                    if(hoverIndex === -1){
                        return;
                    }

                    _showEle.val(value).blur();
                    _changeSelect();
                    if(_isMulti){
                        _showEle.focus();
                    }
                    return;
                }if(e.keyCode === 38){
                    if(hoverIndex === 0 || hoverIndex === -1){
                        hoverIndex = itemLen - 1;
                    }else{
                        --hoverIndex;
                    }
                    _panelEle.children().removeClass('combo_item_hover').eq(hoverIndex).addClass('combo_item_hover');

                    //滚动条
                    if(_panelEle.find('.combo_item_hover').position().top > _panelEle.scrollTop()){
                        _panelEle.scrollTop(_panelEle.find('.combo_item_hover').position().top);
                    }else if(_panelEle.find('.combo_item_hover').position().top < 0){
                        _panelEle.scrollTop(_panelEle.scrollTop() - _panelEle.find('.combo_item_hover').outerHeight());
                    }
                }else if(e.keyCode === 40){
                    if(hoverIndex < itemLen - 1){
                        ++hoverIndex;
                    }else{
                        hoverIndex = 0;
                    }
                    _panelEle.children().removeClass('combo_item_hover').eq(hoverIndex).addClass('combo_item_hover');

                    //滚动条
                    if(_panelEle.find('.combo_item_hover').position().top >= _panelEle.outerHeight() - _panelEle.find('.combo_item_hover').outerHeight()){
                        _panelEle.scrollTop(_panelEle.scrollTop() + _panelEle.find('.combo_item_hover').outerHeight());
                    }else if(_panelEle.find('.combo_item_hover').position().top < 0){
                        _panelEle.scrollTop(0);
                    }
                }
            }).bind('blur', function(e){
                if(!_checkKey && !_isMulti){
                    return;
                }

                var value = $.trim($(this).val()),
                    valueIndex,
                    lastKey = $.trim(_hideEle.val()),
                    curKey = '',
                    valArr = [];

                if(!value){
                    _hideEle.val('');
                    return;
                }

                if(_isMulti){
                    valArr = value.split(_separate);
                    value = '';

                    for (var i = 0; i < valArr.length; i++) {
                        if((',' + _strData).indexOf(',' + encodeURIComponent(valArr[i]) + '#') !== -1 && (_separate + value + _separate).indexOf(valArr[i]) === -1){
                            value += valArr[i] + _separate;
                            curKey += decodeURIComponent(_strData.split(encodeURIComponent(valArr[i]) + '#')[1].split(',')[0]) + _separate;
                        }
                    }

                    $(this).val(value);
                    if(curKey !== lastKey){
                        _hideEle.val(curKey);
                        _comboObj.select(curKey);
                    }
                }else{
                    valueIndex = (',' + _strData).indexOf(',' + encodeURIComponent(value) + '#');
                    if(valueIndex !== -1){
                        curKey = decodeURIComponent(_strData.split(encodeURIComponent(value) + '#')[1].split(',')[0]);

                        if(curKey !== lastKey){
                            _hideEle.val(curKey);
                            _comboObj.select(curKey);
                        }
                    }else{
                        _hideEle.val('');
                        $(this).val('');
                    }
                }
            });


            $('.combo_item').live('mouseenter', function(){
                $(this).addClass('combo_item_hover').siblings().removeClass('combo_item_hover');
            });


            $('html').bind('click', function(){
                var isVisible = false;
                if(_panelEle && _panelEle.is(':visible')){
                    isVisible = true;
                }
                _panelEle && _panelEle.hide();
                _panelEle && isVisible && _comboObj.close();
            });
        }
    },
    require: ['../css/blue/combobox.css']
});