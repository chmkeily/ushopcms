cloudjs.define({
    calendar: function(options){
        var defaults = {
            months: 2,               // 同时显示的月份数
            width: 220,              // 单个月时日历控件的宽度
            zIndex: cloudjs.zIndex(),// 日历控件的层级
            beginYear: -40,          // 开始年份
            endYear: +10,            // 结束年份
            monSelect: true,         // 是否可选择年份和月份
            showIcon: true,          // 是否显示图标
            placeholder: '',         // 输入框中显示的placeholder信息
            timeFormat: 'yyyy-mm-dd',// 输出到输入框的日期格式
            minDate: null,           // 可选的最小日期，用于范围选择
            maxDate: null,           // 可选的最大日期，用于范围选择
            multiSelect: false,      // 选择一段时间,另一种形式的范围选择
            startDate: '',           // 时间段的默认开始日期
            endDate: '',             // 时间段的默认结束日期
            onSelect: $.noop,        // 选择日期后触发的事件
            onClose: $.noop          // 关闭日历控件后触发的事件
        };
        
        if($.isPlainObject(options) || !options){
            $.extend(defaults, options);
        } else if(typeof options === 'string'){
            if(options === 'update' && $.isPlainObject(arguments[1])){
                var obj = this.data('calendar');
                if(!obj) return;
                $.extend(obj.dfts, arguments[1]);
                return true;
            }else if(options === 'destroy'){
                _destroy(this);
                return true;
            }
        }
        
        var _self = this,
            _defaults = defaults,
            _months = new Date().getFullYear() * 12 + new Date().getMonth(),
            _panel = null,
            _calendarWarpper = null,
            _calendarObj = null,
            _beginYear = new Date().getFullYear() + parseInt(_defaults.beginYear),
            _endYear = new Date().getFullYear() + parseInt(_defaults.endYear),
            _timeFormat = _defaults.timeFormat,
            _timer = -1,
            // 绑定到输入框和document的三个事件侦听器
            _handleEvent = {
                showCalendar: function(e){
                    e.stopPropagation();
                    _calendarObj.show();
                    _calendarObj.shown = true;
                },
                hideCalendar: function(e){
                    if(!_calendarObj.mouseover){
                        _calendarObj.hide();
                        _calendarObj.shown = false;
                    }
                },
                documentHandle: function(e){
                    if(_calendarObj.shown){
                        _calendarObj.hide();
                        _calendarObj.shown = false;
                    }
                }
            };
       
        if(!_beginYear){
            _beginYear = 1940;
        }
        if(!_endYear){
            _endYear = 2020;
        }
        _timer = _defaults.timeFormat.toLowerCase().indexOf('hh');
               
        _init();
       
        /**
         * 初始化组件
         */
        function _init(){
            var calendarIcon, startDateHidden, endDateHidden;
            if(_defaults.showIcon){
                calendarIcon = document.createElement('span');
                calendarIcon.className = 'calendar_icon cloudjs_icon';
                _self.wrap('<span class="calendar_inputs_wrap"></span>');
                _self.after(calendarIcon);
            }
            if(_defaults.multiSelect){
                _self.attr('readonly', 'readonly');
                startDateHidden = document.createElement('input');
                startDateHidden.type = 'hidden';
                startDateHidden.value = _defaults.startDate;
                startDateHidden.className = 'startDate';
                _self.after(startDateHidden);
                endDateHidden = document.createElement('input');
                endDateHidden.type = 'hidden';
                endDateHidden.value = _defaults.endDate;
                endDateHidden.className = 'endDate';
                _self.after(endDateHidden);
                _self.data('startDateHd' , startDateHidden);
                _self.data('endDateHd' , endDateHidden);
                if(_defaults.endDate && _defaults.startDate){
                    _self.val(_defaults.startDate + ' 至 ' + _defaults.endDate);
                }
            }
            _self.data('calendar', _getCalendarObj());
            _calendarObj = _self.data('calendar');
            _calendarObj.calendarIcon = $(calendarIcon);
            _listen();
            _calendarObj.createCalendarBox();
            _self.attr('placeholder', _defaults.placeholder);
            _self.data('date', '');
            _self.data('handler', _handleEvent);
        }
       
        /**
         * 给输入框绑定事件
         */
        function _listen(){
            $(document).bind('click', _handleEvent.documentHandle);
            $(window).bind('resize', _handleEvent.documentHandle);
            _self.bind('click', _handleEvent.showCalendar);
            _self.bind('blur', _handleEvent.hideCalendar);
            _calendarObj.calendarIcon.bind('click', _handleEvent.showCalendar);
        }
       
        /**
         * 销毁事件
         */
        function _destroy(tar){
            _handleEvent = tar.data('handler');
            if(!_handleEvent) return;
            $(document).unbind('click', _handleEvent.documentHandle);
            $(window).unbind('resize', _handleEvent.documentHandle);
            tar.unbind('click', _handleEvent.showCalendar);
            tar.unbind('blur', _handleEvent.hideCalendar);
            tar.removeData('calendar');
            tar.removeData('date');
            tar.removeData('handler');
        }
       
        /**
         * 获取日历对象
         */
        function _getCalendarObj(){
            var calendarObj = {
                dfts: _defaults,
                rangeArr: [],
               
                /**
                 * 绘制单个日历面板
                 * @param {Number} n    绘制面板的个数
                 */
                draw: function(n){
                    var self = this,
                        tmpWeeks = '',
                        tmpDays = '',
                        calendarCon = document.createElement('div'),
                        yearSelect = '',
                        monSelect = '',
                        currTime = _months + n,
                        i = 0,
                        $panel = $(_panel),
                        currYear = parseInt(currTime / 12),
                        currMon = currTime - currYear * 12 + 1,
                        calendarTitle, calendarDays, calendarWeek;
                    for(; i < 7; i++){
                        tmpWeeks += '<span>' + '日一二三四五六'.charAt(i) + '</span>';
                    }
                    for(i = 0; i < 42; i++){
                        tmpDays += '<a class="disabled day" href="javascript:;"></a>';
                    }
                    for(i = 1; i <= 12; i++){
                        if(i === currMon){
                            monSelect += '<option value="' + i + '" selected="selected">' + i + '月</option>';
                        }else {
                            monSelect += '<option value="' + i + '">' + i + '月</option>';
                        }
                    }
                    for(i = _endYear; i >= _beginYear; i--){
                        if(i === currYear){
                            yearSelect += '<option value="' + i + '" selected="selected">' + i + '</option>';
                        }else {
                            yearSelect += '<option value="' + i + '">' + i + '</option>';
                        }
                    }
                    if(self.dfts.monSelect && n === 0){
                        calendarTitle = '<div class="calendar_title"><div class="select_box"><select class="year_select">'+yearSelect+'</select>';
                        calendarTitle += ' <select class="mon_select">' + monSelect + '</select></div></div>';
                    }else{
                        calendarTitle = '<div class="calendar_title"><em class="curr_year">' + currYear + '年</em> <em class="curr_mon">' + currMon + '月</em></div></div>';
                    }
                   
                    calendarWeek = '<p class="calendar_week">' + tmpWeeks + '</p>';
                    calendarDays = '<div class="calendar_days">' + tmpDays + '</div>';
                    calendarCon.className = 'calendar_form';
                    calendarCon.innerHTML += calendarTitle + calendarWeek + calendarDays;
                    $panel.append(calendarCon);
                    calendarCon.style.width = self.dfts.width + 'px';
                    self.bindData(calendarCon, currYear, currMon);
                },
               
                /**
                 * 绑定数据
                 * @param {Element} box
                 * @param {Number} year
                 * @param {Number} months
                 */
                bindData: function(box, year, months){
                    var self = this,
                        dateArray = _getMonthViewDateArray(year, months - 1),
                        today = new Date().toDateString(),
                        val = $.trim(_self.val()),
                        selectedDay = _formatToDay(val) ? _formatToDay(val).toDateString() : undefined,
                        $inputs = $('.calendar_time_box').find('.multi_input'),
                        $box = $(box), startDate, endDate,
                        tds = $box.find('.day'), currDate, i = 0, $tds;
                    $box.find('.today').removeClass('today').find('.current').removeClass('current');
                    for(; i < tds.length; i++){
                        if(i > dateArray.length - 1) continue;
                        if(dateArray[i]){
                           currDate = new Date(year, months - 1, dateArray[i]).toDateString();
                           $tds = tds.eq(i);
                           $tds.attr('data-value', currDate);
                           if (today === currDate){
                               $tds.addClass('today');
                           }
                           if(selectedDay === currDate){
                               $tds.addClass('current');
                           }
                           if(self.dfts.multiSelect){
                               startDate = _self.data('startDateHd').value;
                               endDate = _self.data('endDateHd').value;
                               if(new Date(currDate) > _formatToDay(startDate) && new Date(currDate) < _formatToDay(endDate)){
                                   $tds.addClass('calendar_range');
                               }
                               if(currDate === _formatToDay(startDate).toDateString() || currDate === _formatToDay(endDate).toDateString()){
                                   $tds.addClass('current');
                               }
                           }
                           $tds.html(dateArray[i]);
                           self.setEnable(tds[i]);
                        }
                    }
                },
               
                /**
                 * 设置时间范围
                 * @param {Element} tds  面板中的每一个日期元素
                 */
                setEnable: function(tds){
                    var self = this,
                        $tds = $(tds),
                        dateValue = tds.getAttribute('data-value'),
                        dateCount = _formatToDay(dateValue),
                        start,end;
                    // 处理开始日期
                    start = self.getRangeDate(self.dfts.minDate);
                    if(typeof start === 'undefined'){
                        start = _formatToDay(_beginYear + ',01,01');
                    }
                    // 处理结束日期
                    end = self.getRangeDate(self.dfts.maxDate);
                    if(typeof end === 'undefined'){
                        end = _formatToDay(_endYear + ',12,31');
                    }
                    
                    if(dateCount >= start && dateCount <= end){
                        $tds.removeClass('disabled');
                    }
                },
               
                /**
                 * 获得所设置最大值或最小值的时间对象
                 * @param {String} str  设置的最大值或最小值
                 */
                getRangeDate: function(str){
                    str = $.trim(str);
                    if(!str){
                        return;
                    }else if(/^\d{4}[,-/]?\d{1,2}[,-/]?\d{1,2}$/g.test(str)){
                        return _formatToDay(str);
                    }else{
                        str = str.toLowerCase();
                        var arrStr = str.split(','),
                            now = new Date(),
                            nowYear = now.getFullYear(),
                            nowMonth = now.getMonth(),
                            nowDate = now.getDate(),
                            newDate, i = 0;
                        for(; i < arrStr.length; i++){
                            if(/([-+]?\d+)([ymd])/g.test(arrStr[i])){
                                switch (RegExp.$2){
                                    case 'y' :
                                        nowYear += Number(RegExp.$1);
                                        break;
                                    case 'm' :
                                        nowMonth += Number(RegExp.$1);
                                        break;
                                    case 'd' :
                                        nowDate += Number(RegExp.$1);
                                        break;
                                }
                                newDate = new Date(nowYear, nowMonth, nowDate);
                            }
                        }
                        return newDate;
                    }
                },
               
                /**
                 * 创建日历容器
                 */
                createCalendarBox: function(){
                    var calendarWarpper, calendarBox;
                    if(cloudjs._calendarHasDraw){
                        _panel = $('.calendar_panel')[0];
                        _calendarWarpper = $('.calendar_warpper')[0];
                        return;
                    };
                    cloudjs._calendarHasDraw = true;
                    calendarWarpper = document.createElement('div');
                    calendarBox = document.createElement('div');
                    calendarWarpper.id = 'calendar_warpper';
                    calendarWarpper.className = 'calendar_warpper';
                    calendarWarpper.style.display = 'none';
                    _calendarWarpper = calendarWarpper;
                    calendarBox.className = 'calendar_panel';
                    _panel = calendarBox;
                    calendarWarpper.appendChild(calendarBox);
                    document.body.appendChild(calendarWarpper);
                },
               
                /**
                 * 填充日历面板
                 */
                fillPanel: function(){
                    var self = this,
                        tmpStr = '<a class="calendar_pre_mon"><i class="cloudjs_icon"></i></a><a class="calendar_next_mon"><i class="cloudjs_icon"></i></a>',
                        i = 0,
                        len = self.dfts.months;
                    _panel.innerHTML = tmpStr;
                    for(; i < len; i++){
                        self.draw(i);
                    }
                    self.drawTimeBox();
                    self.bindEvent();
                },
               
                /**
                 * 绘制时间面板
                 */
                drawTimeBox: function(){
                    var self = this,
                        d = _formatToDay(_self.val()),
                        timeTpl, timeStr, timeCon, startDate, endDate,
                        minSelectDay = '',
                        maxSelectDay = '';
                    timeCon = document.createElement('div');
                    _panel.appendChild(timeCon);
                    timeCon.className = 'calendar_time_box';
                    if(_defaults.multiSelect){
                        startDate = _self.data('startDateHd').value,
                        endDate = _self.data('endDateHd').value,
                        _timer = -1;
                        if(startDate){
                            self.rangeArr.push(startDate);
                        }
                        if(endDate){
                            self.rangeArr.push(endDate);
                        }
                        minSelectDay = _formatToStr(_formatToDay(startDate), 'yyyy-mm-dd') || '';
                        maxSelectDay = _formatToStr(_formatToDay(endDate), 'yyyy-mm-dd') || '';
                        timeTpl = '<div style="float:left"><input class="min_date multi_input" value="' + minSelectDay + '" type="text" readonly="readonly">-';
                        timeTpl += '<input class="max_date multi_input" type="text" value="' + maxSelectDay + '" readonly="readonly"></div>';
                        timeTpl += '<input type="button" class="multi_submit cloudjs_btn" value="确定">';
                        timeCon.innerHTML = timeTpl;
                    }
                    if(_timer > -1){
                        timeStr = self.dfts.timeFormat.substring(_timer);
                        timeTpl = '<div style="float:left">时间：<input class="hour_select date_input" type="number" value="0" min="0" max="23">h ';
                        if(timeStr.indexOf('hh:mm') > -1){
                            timeTpl += '<input type="number" class="min_select date_input" value="0" min="0" max="59">m ';
                        }
                        if(timeStr.indexOf('hh:mm:ss') > -1){
                            timeTpl += '<input type="number" class="sec_select date_input" value="0" min="0" max="59">s ';
                        }
                        timeTpl += '</div>';
                        timeTpl += '<input type="button" class="time_submit cloudjs_btn" value="确定">';
                        timeCon.innerHTML = timeTpl;
                        if(d){
                            $('.hour_select').val(d.getHours());
                            $('.min_select').val(d.getMinutes());
                            $('.sec_select').val(d.getSeconds());
                        }
                    }
                    if(!_defaults.multiSelect){
                        $(timeCon).append('<input type="button" class="today_submit cloudjs_btn_white" value="今天">');
                        if(_defaults.minDate && self.getRangeDate(_defaults.minDate) > new Date()){
                            $('.today_submit').attr('disabled', 'disabled');
                        }else if(_defaults.maxDate && self.getRangeDate(_defaults.maxDate) < new Date()){
                            $('.today_submit').attr('disabled', 'disabled');
                        }
                    }
                },
               
                /**
                 * 显示日历面板
                 */
                show: function(){
                    var self = this;
                    self.fillPanel();
                    $(_calendarWarpper).show();
                    self.setPosition();
                    self.shown = true;
                },
               
                /**
                 * 隐藏日历面板
                 */
                hide: function(){
                    var self = this,
                        $calendarWarpper = $(_calendarWarpper),
                        _selfVal = _self.val(),
                        selects = $calendarWarpper.find('.date_input'),
                        dateStr = '',
                        startDate, endDate;
                    self.shown = false;
                    $calendarWarpper.hide();
                    $calendarWarpper.undelegate('click');
                    $calendarWarpper.unbind('click');
                    $calendarWarpper.unbind('mouseenter');
                    $calendarWarpper.unbind('mouseleave');
                    if(_defaults.multiSelect && self.rangeArr.length === 1){
                        self.rangeArr[1] = new Date().toDateString();
                        self.rangeArr.sort(function(a, b){
                            return _formatToDay(a) - _formatToDay(b);
                        })
                        startDate = new Date(self.rangeArr[0]);
                        endDate = new Date(self.rangeArr[1]);
                        _self.val(_formatToStr(startDate, _defaults.timeFormat) + ' 至 ' + _formatToStr(endDate, _defaults.timeFormat));
                        _self.data('startDateHd').value = _formatToStr(startDate, _defaults.timeFormat);
                        _self.data('endDateHd').value = _formatToStr(endDate, _defaults.timeFormat);
                    }
                    if(_selfVal !== ''){
                        _selfVal = $.trim(_selfVal.split(' 至 ')[0]);
                        if(_formatToDay(_selfVal) == 'Invalid Date'){
                            _self.val('');
                        }else{
                            _months = _formatToDay(_selfVal).getFullYear() * 12 + _formatToDay(_selfVal).getMonth();
                        }
                    }else{
                        _self.val('');
                    }
                    self.dfts.onClose.call(_self[0]);
                },
               
                /**
                 * 设置位置
                 */
                setPosition: function(){
                    var self = this,
                        $calendarWarpper = $(_calendarWarpper),
                        $panel = $(_panel),
                        offset = _self.offset(),
                        h = _self.outerHeight(),
                        t;
                    $panel.width(self.dfts.width * self.dfts.months);
                    if(offset.top + h + $panel.outerHeight() > $(window).height() + $(window).scrollTop()){
                        t = offset.top - $panel.outerHeight();
                    }else{
                        t = offset.top + h;
                    }
                    $calendarWarpper.css({
                        width: (self.dfts.width + 1) * self.dfts.months,
                        zIndex: (cloudjs.zIndex() > self.dfts.zIndex ? cloudjs.zIndex() : self.dfts.zIndex),
                        left: offset.left,
                        top: t
                    });
                },
               
                /**
                 * 显示前一月
                 */
                goPrevMonth: function(){
                    var self = this;
                    if(_months <= _beginYear * 12){
                        return;
                    }
                    _months--;
                    self.fillPanel();
                },
               
                /**
                 * 显示后一月
                 */
                goNextMonth: function(){
                    var self = this;
                    if(_months >= _endYear * 12 + 11){
                        return;
                    }
                    _months++;
                    self.fillPanel();
                },
               
                /**
                 * 绑定事件
                 */
                bindEvent: function(){
                    var $calendarWarpper = $(_calendarWarpper),
                        $yearSelect = $calendarWarpper.find('.year_select'),
                        $monSelect = $calendarWarpper.find('.mon_select'),
                        self = this;
                    $calendarWarpper.undelegate('click');
                    $calendarWarpper.unbind('click');
                    $yearSelect.unbind('change');
                    $monSelect.unbind('change');
                    $calendarWarpper.unbind('mouseenter');
                    $calendarWarpper.unbind('mouseleave');
                    $calendarWarpper.bind('click', function(e){
                        e.stopPropagation();
                    })
                    $calendarWarpper.bind('mouseenter', function(){
                        self.mouseover = true;
                    })
                    $calendarWarpper.bind('mouseleave', function(){
                        self.mouseover = false;
                    })
                    // IE6,7,8,9不支持表单事件冒泡，所以delegate事件委托会失效
                    $yearSelect.bind('change', function(){
                        _months = $(this).val() * 12 + parseInt($monSelect.val())-1;
                        self.fillPanel();
                    })
                    $monSelect.bind('change', function(){
                        _months = $yearSelect.val() * 12 + parseInt($(this).val())-1;
                        self.fillPanel();
                    })
                    $calendarWarpper.delegate('.calendar_pre_mon', 'click', function(){
                        self.goPrevMonth();
                    })
                    $calendarWarpper.delegate('.calendar_next_mon', 'click', function(){
                        self.goNextMonth();
                    })
                    $calendarWarpper.delegate('.time_submit', 'click', function(){
                        var strDate = '',
                            selects = $('.calendar_time_box').find('.date_input'),
                            currDay = _self.data('date') ? _formatToDay(_self.data('date')).toDateString() : new Date().toDateString();
                        selects.each(function(index){
                            if(!Number(this.value)){
                                this.value = 0;
                            }
                            if(this.value > 59){
                                this.value = 59;
                            }
                            if(this.value < 0){
                                this.value = 0;
                            }
                            if(selects[0].value > 23){
                                selects[0].value = 23;
                            }
                            strDate += _formatDate(this.value) + ':';
                        })
                        strDate=strDate.replace(/:$/,'');
                        _self.val(_formatToStr(new Date(currDay + ' ' + strDate), _defaults.timeFormat));
                        self.hide();
                        self.shown = false;
                    })
                    $calendarWarpper.delegate('.multi_submit', 'click', function(){
                        var inputs = $('.calendar_time_box').find('.multi_input'),
                            val1 = _formatToStr(_formatToDay(inputs.eq(0).val()), _defaults.timeFormat),
                            val2 = _formatToStr(_formatToDay(inputs.eq(1).val()), _defaults.timeFormat);
                        if(inputs.eq(0).val()==='' && inputs.eq(1).val()==='') return;
                        if(inputs.eq(1).val() === ''){
                            self.rangeArr[1] = new Date().toDateString();
                            self.rangeArr.sort(function(a, b){
                                return _formatToDay(a) - _formatToDay(b);
                            })
                            val1 = _formatToStr(new Date(self.rangeArr[0]), _defaults.timeFormat);
                            val2 = _formatToStr(new Date(self.rangeArr[1]), _defaults.timeFormat);
                        };
                        _self.val(val1 + ' 至 ' + val2);
                        _self.data('startDateHd').value = val1;
                        _self.data('endDateHd').value = val2;
                        self.hide();
                        self.shown = false;
                    })
                    $calendarWarpper.delegate('.today_submit', 'click', function(){
                        _self.val(_formatToStr(new Date(), _defaults.timeFormat));
                        self.hide();
                        self.shown = false;
                    })
                    $calendarWarpper.delegate('.day', 'click', function(){
                        var $this = $(this),
                            selects = $('.calendar_time_box').find('.date_input'),
                            multiInputs = $('.calendar_time_box').find('.multi_input'),
                            $tds = $calendarWarpper.find('.day'),
                            _selfVal = _formatToStr(new Date($this.attr('data-value')), _defaults.timeFormat),
                            i = 0, len = $tds.length, dateCount, dateStr = '', startDate, endDate;
                        if($this.hasClass('disabled')){
                            return;
                        }
                        if(!_defaults.multiSelect){
                            selects.each(function(){
                                dateStr += _formatDate(this.value) + ':';
                            });
                            dateStr = dateStr.replace(/:$/g, '');
                            _selfVal = _selfVal.split(/\s/)[0];
                            _self.val($.trim(_selfVal + ' ' + dateStr));
                            _self.data('date', $this.attr('data-value'));
                            $calendarWarpper.find('.current').removeClass('current');
                        }else{
                            if(self.rangeArr.length >= 2){
                                self.rangeArr = [];
                                $calendarWarpper.find('.current').removeClass('current');
                                $calendarWarpper.find('.calendar_range').removeClass('calendar_range');
                                multiInputs.val('');
                                _self.val('');
                            }
                            if(self.rangeArr.length === 0){
                                self.rangeArr.push($this.attr('data-value'));
                                startDate = new Date(self.rangeArr[0]);
                                multiInputs.eq(0).val(_formatToStr(startDate, 'yyyy-mm-dd'));
                                _self.val(_formatToStr(startDate, _defaults.timeFormat));
                            }else if(self.rangeArr.length === 1){
                                self.rangeArr.push($this.attr('data-value'));
                                self.rangeArr.sort(function(a, b){
                                    return _formatToDay(a) - _formatToDay(b);
                                })
                                startDate = new Date(self.rangeArr[0]);
                                endDate = new Date(self.rangeArr[1]);
                                multiInputs.eq(0).val(_formatToStr(startDate, 'yyyy-mm-dd'));
                                multiInputs.eq(1).val(_formatToStr(endDate, 'yyyy-mm-dd'));
                                _self.val(_formatToStr(startDate, _defaults.timeFormat) + ' 至 ' + _formatToStr(endDate, _defaults.timeFormat));
                                _self.data('startDateHd').value = _formatToStr(startDate, _defaults.timeFormat);
                                _self.data('endDateHd').value = _formatToStr(endDate, _defaults.timeFormat);
                            }
                        }
                        $this.addClass('current');
                        self.dfts.onSelect.call(_self[0]);
                        if(_timer>-1 || (_defaults.multiSelect && !self.rangeArr[1])){
                            return;
                        }
                        self.hide();
                        self.shown = false;
                    })
                }
            };
            return calendarObj;
        }
       
        /**
         * 格式化日期
         * @param {Number} n 日期或月数
         */
        function _formatDate(n){
            return (n < 10 ? '0' + n : n).toString();
        }
       
        /**
         * 将Date对象变成字符串
         * @param {Object} date
         * @param {String} format
         */
        function _formatToStr(date, format){
            if(!date) return;
            return format.replace(/yyyy/gi, date.getFullYear().toString())
                  .replace(/MM/i, _formatDate(date.getMonth() + 1))
                  .replace(/dd/gi, _formatDate(date.getDate()))
                  .replace(/hh/gi, _formatDate(date.getHours()))
                  .replace(/mm/gi, _formatDate(date.getMinutes()))
                  .replace(/ss/gi, _formatDate(date.getSeconds()));
        }
       
        /**
         * 将日期字符串变成Date对象
         * @param {String} date  时间字符串
         */
        function _formatToDay(date){
            var regFormat = /^(\d{4})([,-/])?(\d{2})([,-/])?(\d{2})(\s\d\d)?(:\d\d)?(:\d\d)?$/g,
                hour, minute, seconds, dateStr;
            if(!date) return;
            if(regFormat.test(date)){
                hour = RegExp.$6 ? parseInt(RegExp.$6) : 0;
                minute = RegExp.$7 ? parseInt(RegExp.$7.substring(1)) : 0;
                seconds = RegExp.$8 ? parseInt(RegExp.$8.substring(1)) : 0;
                return new Date(RegExp.$1, RegExp.$3 - 1, RegExp.$5, hour, minute, seconds);
            }
            return new Date(date);
        }
       
        /**
         * 生成星期对应天数数组
         * @param {Number} y 年
         * @param {Number} m 月
         */
        function _getMonthViewDateArray(y, m){
            var dateArray = new Array(42),
                dayOfFirstDate = new Date(y, m, 1).getDay(),
                dateCountOfMonth = new Date(y, m + 1, 0).getDate(),
                i = 0;
            for(; i < dateCountOfMonth; i++){
                dateArray[i + dayOfFirstDate] = i + 1;
            }
            return dateArray;
        }
    },
    require: ['../css/' + cloudjs.themes() + '/calendar.css']
})
