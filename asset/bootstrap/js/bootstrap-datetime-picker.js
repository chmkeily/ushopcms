/* =========================================================
 * bootstrap-timepicker.js
 * http://www.github.com/jdewit/bootstrap-timepicker
 * =========================================================
 * Copyright 2012
 *
 * Created By:
 * Joris de Wit @joris_dewit
 *
 * Contributions By:
 * Gilbert @mindeavor
 * Koen Punt info@koenpunt.nl
 * Nek
 * Chris Martin
 * Dominic Barnes contact@dominicbarnes.us
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
!function($){"use strict";var Timepicker=function(element,options){this.$element=$(element);this.options=$.extend({},$.fn.timepicker.defaults,options,this.$element.data());this.minuteStep=this.options.minuteStep||this.minuteStep;this.secondStep=this.options.secondStep||this.secondStep;this.showMeridian=this.options.showMeridian||this.showMeridian;this.showSeconds=this.options.showSeconds||this.showSeconds;this.showInputs=this.options.showInputs||this.showInputs;this.disableFocus=this.options.disableFocus||this.disableFocus;this.template=this.options.template||this.template;this.modalBackdrop=this.options.modalBackdrop||this.modalBackdrop;this.defaultTime=this.options.defaultTime||this.defaultTime;this.open=false;this.init();};Timepicker.prototype={constructor:Timepicker,init:function(){if(this.$element.parent().hasClass('input-append')){this.$element.parent('.input-append').find('.add-on').on('click',$.proxy(this.showWidget,this));this.$element.on({focus:$.proxy(this.highlightUnit,this),click:$.proxy(this.highlightUnit,this),keypress:$.proxy(this.elementKeypress,this),blur:$.proxy(this.blurElement,this)});}else{if(this.template){this.$element.on({focus:$.proxy(this.showWidget,this),click:$.proxy(this.showWidget,this),blur:$.proxy(this.blurElement,this)});}else{this.$element.on({focus:$.proxy(this.highlightUnit,this),click:$.proxy(this.highlightUnit,this),keypress:$.proxy(this.elementKeypress,this),blur:$.proxy(this.blurElement,this)});}}
this.$widget=$(this.getTemplate()).appendTo('body');this.$widget.on('click',$.proxy(this.widgetClick,this));if(this.showInputs){this.$widget.find('input').on({click:function(){this.select();},keypress:$.proxy(this.widgetKeypress,this),change:$.proxy(this.updateFromWidgetInputs,this)});}
this.setDefaultTime(this.defaultTime);},showWidget:function(e){e.stopPropagation();e.preventDefault();if(this.open){return;}
this.$element.trigger('show');if(this.disableFocus){this.$element.blur();}
var pos=$.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});this.updateFromElementVal();$('html').trigger('click.timepicker.data-api').one('click.timepicker.data-api',$.proxy(this.hideWidget,this));if(this.template==='modal'){this.$widget.modal('show').on('hidden',$.proxy(this.hideWidget,this));}else{this.$widget.css({top:pos.top+pos.height,left:pos.left})
if(!this.open){this.$widget.addClass('open');}}
this.open=true;this.$element.trigger('shown');},hideWidget:function(){this.$element.trigger('hide');if(this.template==='modal'){this.$widget.modal('hide');}else{this.$widget.removeClass('open');}
this.open=false;this.$element.trigger('hidden');},widgetClick:function(e){e.stopPropagation();e.preventDefault();var action=$(e.target).closest('a').data('action');if(action){this[action]();this.update();}},widgetKeypress:function(e){var input=$(e.target).closest('input').attr('name');switch(e.keyCode){case 9:if(this.showMeridian){if(input=='meridian'){this.hideWidget();}}else{if(this.showSeconds){if(input=='second'){this.hideWidget();}}else{if(input=='minute'){this.hideWidget();}}}
break;case 27:this.hideWidget();break;case 38:switch(input){case'hour':this.incrementHour();break;case'minute':this.incrementMinute();break;case'second':this.incrementSecond();break;case'meridian':this.toggleMeridian();break;}
this.update();break;case 40:switch(input){case'hour':this.decrementHour();break;case'minute':this.decrementMinute();break;case'second':this.decrementSecond();break;case'meridian':this.toggleMeridian();break;}
this.update();break;}},elementKeypress:function(e){var input=this.$element.get(0);switch(e.keyCode){case 0:break;case 9:this.updateFromElementVal();if(this.showMeridian){if(this.highlightedUnit!='meridian'){e.preventDefault();this.highlightNextUnit();}}else{if(this.showSeconds){if(this.highlightedUnit!='second'){e.preventDefault();this.highlightNextUnit();}}else{if(this.highlightedUnit!='minute'){e.preventDefault();this.highlightNextUnit();}}}
break;case 27:this.updateFromElementVal();break;case 37:this.updateFromElementVal();this.highlightPrevUnit();break;case 38:switch(this.highlightedUnit){case'hour':this.incrementHour();break;case'minute':this.incrementMinute();break;case'second':this.incrementSecond();break;case'meridian':this.toggleMeridian();break;}
this.updateElement();break;case 39:this.updateFromElementVal();this.highlightNextUnit();break;case 40:switch(this.highlightedUnit){case'hour':this.decrementHour();break;case'minute':this.decrementMinute();break;case'second':this.decrementSecond();break;case'meridian':this.toggleMeridian();break;}
this.updateElement();break;}
if(e.keyCode!==0&&e.keyCode!==8&&e.keyCode!==9&&e.keyCode!==46){e.preventDefault();}},setValues:function(time){if(this.showMeridian){var arr=time.split(' ');var timeArray=arr[0].split(':');this.meridian=arr[1];}else{var timeArray=time.split(':');}
this.hour=parseInt(timeArray[0],10);this.minute=parseInt(timeArray[1],10);this.second=parseInt(timeArray[2],10);if(isNaN(this.hour)){this.hour=0;}
if(isNaN(this.minute)){this.minute=0;}
if(this.showMeridian){if(this.hour>12){this.hour=12;}else if(this.hour<1){this.hour=1;}
if(this.meridian=='am'||this.meridian=='a'){this.meridian='AM';}else if(this.meridian=='pm'||this.meridian=='p'){this.meridian='PM';}
if(this.meridian!='AM'&&this.meridian!='PM'){this.meridian='AM';}}else{if(this.hour>=24){this.hour=23;}else if(this.hour<0){this.hour=0;}}
if(this.minute<0){this.minute=0;}else if(this.minute>=60){this.minute=59;}
if(this.showSeconds){if(isNaN(this.second)){this.second=0;}else if(this.second<0){this.second=0;}else if(this.second>=60){this.second=59;}}
if(this.$element.val()!='')
this.updateElement();this.updateWidget();},setMeridian:function(meridian){if(meridian=='a'||meridian=='am'||meridian=='AM'){this.meridian='AM';}else if(meridian=='p'||meridian=='pm'||meridian=='PM'){this.meridian='PM';}else{this.updateWidget();}
this.updateElement();},setDefaultTime:function(defaultTime){if(defaultTime){if(defaultTime==='current'){var dTime=new Date();var hours=dTime.getHours();var minutes=Math.floor(dTime.getMinutes()/this.minuteStep)*this.minuteStep;var seconds=Math.floor(dTime.getSeconds()/this.secondStep)*this.secondStep;var meridian="AM";if(this.showMeridian){if(hours===0){hours=12;}else if(hours>=12){if(hours>12){hours=hours-12;}
meridian="PM";}else{meridian="AM";}}
this.hour=hours;this.minute=minutes;this.second=seconds;this.meridian=meridian;}else if(defaultTime==='value'){this.setValues(this.$element.val());}else{this.setValues(defaultTime);}
if(this.$element.val()!='')
this.updateElement();this.updateWidget();}else{this.hour=0;this.minute=0;this.second=0;}},formatTime:function(hour,minute,second,meridian){hour=hour<10?'0'+hour:hour;minute=minute<10?'0'+minute:minute;second=second<10?'0'+second:second;return hour+':'+minute+(this.showSeconds?':'+second:'')+(this.showMeridian?' '+meridian:'');},getTime:function(){return this.formatTime(this.hour,this.minute,this.second,this.meridian);},setTime:function(time){this.setValues(time);this.update();},update:function(){this.updateElement();this.updateWidget();},blurElement:function(){this.highlightedUnit=undefined;this.updateFromElementVal();},updateElement:function(){var time=this.getTime();this.$element.val(time).change();switch(this.highlightedUnit){case'hour':this.highlightHour();break;case'minute':this.highlightMinute();break;case'second':this.highlightSecond();break;case'meridian':this.highlightMeridian();break;}},updateWidget:function(){if(this.showInputs){this.$widget.find('input.bootstrap-timepicker-hour').val(this.hour<10?'0'+this.hour:this.hour);this.$widget.find('input.bootstrap-timepicker-minute').val(this.minute<10?'0'+this.minute:this.minute);if(this.showSeconds){this.$widget.find('input.bootstrap-timepicker-second').val(this.second<10?'0'+this.second:this.second);}
if(this.showMeridian){this.$widget.find('input.bootstrap-timepicker-meridian').val(this.meridian);}}else{this.$widget.find('span.bootstrap-timepicker-hour').text(this.hour);this.$widget.find('span.bootstrap-timepicker-minute').text(this.minute<10?'0'+this.minute:this.minute);if(this.showSeconds){this.$widget.find('span.bootstrap-timepicker-second').text(this.second<10?'0'+this.second:this.second);}
if(this.showMeridian){this.$widget.find('span.bootstrap-timepicker-meridian').text(this.meridian);}}},updateFromElementVal:function(e){var time=this.$element.val();if(time){this.setValues(time);this.updateWidget();}},updateFromWidgetInputs:function(){var time=$('input.bootstrap-timepicker-hour',this.$widget).val()+':'+
$('input.bootstrap-timepicker-minute',this.$widget).val()+
(this.showSeconds?':'+$('input.bootstrap-timepicker-second',this.$widget).val():'')+
(this.showMeridian?' '+$('input.bootstrap-timepicker-meridian',this.$widget).val():'');this.setValues(time);},getCursorPosition:function(){var input=this.$element.get(0);if('selectionStart'in input){return input.selectionStart;}else if(document.selection){input.focus();var sel=document.selection.createRange();var selLen=document.selection.createRange().text.length;sel.moveStart('character',-input.value.length);return sel.text.length-selLen;}},highlightUnit:function(){var input=this.$element.get(0);this.position=this.getCursorPosition();if(this.position>=0&&this.position<=2){this.highlightHour();}else if(this.position>=3&&this.position<=5){this.highlightMinute();}else if(this.position>=6&&this.position<=8){if(this.showSeconds){this.highlightSecond();}else{this.highlightMeridian();}}else if(this.position>=9&&this.position<=11){this.highlightMeridian();}},highlightNextUnit:function(){switch(this.highlightedUnit){case'hour':this.highlightMinute();break;case'minute':if(this.showSeconds){this.highlightSecond();}else{this.highlightMeridian();}
break;case'second':this.highlightMeridian();break;case'meridian':this.highlightHour();break;}},highlightPrevUnit:function(){switch(this.highlightedUnit){case'hour':this.highlightMeridian();break;case'minute':this.highlightHour();break;case'second':this.highlightMinute();break;case'meridian':if(this.showSeconds){this.highlightSecond();}else{this.highlightMinute();}
break;}},highlightHour:function(){this.highlightedUnit='hour';this.$element.get(0).setSelectionRange(0,2);},highlightMinute:function(){this.highlightedUnit='minute';this.$element.get(0).setSelectionRange(3,5);},highlightSecond:function(){this.highlightedUnit='second';this.$element.get(0).setSelectionRange(6,8);},highlightMeridian:function(){this.highlightedUnit='meridian';if(this.showSeconds){this.$element.get(0).setSelectionRange(9,11);}else{this.$element.get(0).setSelectionRange(6,8);}},incrementHour:function(){if(this.showMeridian){if(this.hour===11){this.toggleMeridian();}else if(this.hour===12){return this.hour=1;}}
if(this.hour===23){return this.hour=0;}
this.hour=this.hour+1;},decrementHour:function(){if(this.showMeridian){if(this.hour===1){return this.hour=12;}
else if(this.hour===12){this.toggleMeridian();}}
if(this.hour===0){return this.hour=23;}
this.hour=this.hour-1;},incrementMinute:function(){var newVal=this.minute+this.minuteStep-(this.minute%this.minuteStep);if(newVal>59){this.incrementHour();this.minute=newVal-60;}else{this.minute=newVal;}},decrementMinute:function(){var newVal=this.minute-this.minuteStep;if(newVal<0){this.decrementHour();this.minute=newVal+60;}else{this.minute=newVal;}},incrementSecond:function(){var newVal=this.second+this.secondStep-(this.second%this.secondStep);if(newVal>59){this.incrementMinute();this.second=newVal-60;}else{this.second=newVal;}},decrementSecond:function(){var newVal=this.second-this.secondStep;if(newVal<0){this.decrementMinute();this.second=newVal+60;}else{this.second=newVal;}},toggleMeridian:function(){this.meridian=this.meridian==='AM'?'PM':'AM';this.update();},getTemplate:function(){if(this.options.templates[this.options.template]){return this.options.templates[this.options.template];}
if(this.showInputs){var hourTemplate='<input type="text" name="hour" class="bootstrap-timepicker-hour" maxlength="2"/>';var minuteTemplate='<input type="text" name="minute" class="bootstrap-timepicker-minute" maxlength="2"/>';var secondTemplate='<input type="text" name="second" class="bootstrap-timepicker-second" maxlength="2"/>';var meridianTemplate='<input type="text" name="meridian" class="bootstrap-timepicker-meridian" maxlength="2"/>';}else{var hourTemplate='<span class="bootstrap-timepicker-hour"></span>';var minuteTemplate='<span class="bootstrap-timepicker-minute"></span>';var secondTemplate='<span class="bootstrap-timepicker-second"></span>';var meridianTemplate='<span class="bootstrap-timepicker-meridian"></span>';}
var templateContent='<table class="'+(this.showSeconds?'show-seconds':'')+' '+(this.showMeridian?'show-meridian':'')+'">'+'<tr>'+'<td><a href="#" data-action="incrementHour"><i class="icon-chevron-up"></i></a></td>'+'<td class="separator">&nbsp;</td>'+'<td><a href="#" data-action="incrementMinute"><i class="icon-chevron-up"></i></a></td>'+
(this.showSeconds?'<td class="separator">&nbsp;</td>'+'<td><a href="#" data-action="incrementSecond"><i class="icon-chevron-up"></i></a></td>':'')+
(this.showMeridian?'<td class="separator">&nbsp;</td>'+'<td class="meridian-column"><a href="#" data-action="toggleMeridian"><i class="icon-chevron-up"></i></a></td>':'')+'</tr>'+'<tr>'+'<td>'+hourTemplate+'</td> '+'<td class="separator">:</td>'+'<td>'+minuteTemplate+'</td> '+
(this.showSeconds?'<td class="separator">:</td>'+'<td>'+secondTemplate+'</td>':'')+
(this.showMeridian?'<td class="separator">&nbsp;</td>'+'<td>'+meridianTemplate+'</td>':'')+'</tr>'+'<tr>'+'<td><a href="#" data-action="decrementHour"><i class="icon-chevron-down"></i></a></td>'+'<td class="separator"></td>'+'<td><a href="#" data-action="decrementMinute"><i class="icon-chevron-down"></i></a></td>'+
(this.showSeconds?'<td class="separator">&nbsp;</td>'+'<td><a href="#" data-action="decrementSecond"><i class="icon-chevron-down"></i></a></td>':'')+
(this.showMeridian?'<td class="separator">&nbsp;</td>'+'<td><a href="#" data-action="toggleMeridian"><i class="icon-chevron-down"></i></a></td>':'')+'</tr>'+'</table>';var template;switch(this.options.template){case'modal':template='<div class="bootstrap-timepicker modal hide fade in" style="top: 30%; margin-top: 0; width: 200px; margin-left: -100px;" data-backdrop="'+(this.modalBackdrop?'true':'false')+'">'+'<div class="modal-header">'+'<a href="#" class="close" data-dismiss="modal">×</a>'+'<h3>Pick a Time</h3>'+'</div>'+'<div class="modal-content">'+
templateContent+'</div>'+'<div class="modal-footer">'+'<a href="#" class="btn btn-primary" data-dismiss="modal">Ok</a>'+'</div>'+'</div>';break;case'dropdown':template='<div class="bootstrap-timepicker dropdown-menu">'+
templateContent+'</div>';break;}
return template;}};$.fn.timepicker=function(option){return this.each(function(){var $this=$(this),data=$this.data('timepicker'),options=typeof option=='object'&&option;if(!data){$this.data('timepicker',(data=new Timepicker(this,options)));}
if(typeof option=='string'){data[option]();}})}
$.fn.timepicker.defaults={minuteStep:15,secondStep:15,disableFocus:false,defaultTime:'current',showSeconds:false,showInputs:true,showMeridian:true,template:'dropdown',modalBackdrop:false,templates:{}}
$.fn.timepicker.Constructor=Timepicker}(window.jQuery);

/* =========================================================
 * bootstrap-datepicker.js 
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
!function($){var Datepicker=function(element,options){this.element=$(element);this.format=DPGlobal.parseFormat(options.format||this.element.data('date-format')||'mm/dd/yyyy');this.picker=$(DPGlobal.template).appendTo('body').on({click:$.proxy(this.click,this),mousedown:$.proxy(this.mousedown,this)});this.isInput=this.element.is('input');this.component=this.element.is('.date')?this.element.find('.add-on'):false;if(this.isInput){this.element.on({focus:$.proxy(this.show,this),blur:$.proxy(this.hide,this),keyup:$.proxy(this.update,this)});}else{if(this.component){this.component.on('click',$.proxy(this.show,this));}else{this.element.on('click',$.proxy(this.show,this));}}
this.minViewMode=options.minViewMode||this.element.data('date-minviewmode')||0;if(typeof this.minViewMode==='string'){switch(this.minViewMode){case'months':this.minViewMode=1;break;case'years':this.minViewMode=2;break;default:this.minViewMode=0;break;}}
this.viewMode=options.viewMode||this.element.data('date-viewmode')||0;if(typeof this.viewMode==='string'){switch(this.viewMode){case'months':this.viewMode=1;break;case'years':this.viewMode=2;break;default:this.viewMode=0;break;}}
this.startViewMode=this.viewMode;this.weekStart=options.weekStart||this.element.data('date-weekstart')||0;this.weekEnd=this.weekStart===0?6:this.weekStart-1;this.fillDow();this.fillMonths();this.update();this.showMode();};Datepicker.prototype={constructor:Datepicker,show:function(e){this.picker.show();this.height=this.component?this.component.outerHeight():this.element.outerHeight();this.place();$(window).on('resize',$.proxy(this.place,this));if(e){e.stopPropagation();e.preventDefault();}
if(!this.isInput){$(document).on('mousedown',$.proxy(this.hide,this));}
this.element.trigger({type:'show',date:this.date});},hide:function(){this.picker.hide();$(window).off('resize',this.place);this.viewMode=this.startViewMode;this.showMode();if(!this.isInput){$(document).off('mousedown',this.hide);}
this.element.trigger({type:'hide',date:this.date});},set:function(){var formated=DPGlobal.formatDate(this.date,this.format);if(!this.isInput){if(this.component){this.element.find('input').prop('value',formated);}
this.element.data('date',formated);}else{this.element.prop('value',formated);}},setValue:function(newDate){if(typeof newDate==='string'){this.date=DPGlobal.parseDate(newDate,this.format);}else{this.date=new Date(newDate);}
this.set();this.viewDate=new Date(this.date.getFullYear(),this.date.getMonth(),1,0,0,0,0);this.fill();},place:function(){var offset=this.component?this.component.offset():this.element.offset();this.picker.css({top:offset.top+this.height,left:offset.left});},update:function(newDate){this.date=DPGlobal.parseDate(typeof newDate==='string'?newDate:(this.isInput?this.element.prop('value'):this.element.data('date')),this.format);this.viewDate=new Date(this.date.getFullYear(),this.date.getMonth(),1,0,0,0,0);this.fill();},fillDow:function(){var dowCnt=this.weekStart;var html='<tr>';while(dowCnt<this.weekStart+7){html+='<th class="dow">'+DPGlobal.dates.daysMin[(dowCnt++)%7]+'</th>';}
html+='</tr>';this.picker.find('.datepicker-days thead').append(html);},fillMonths:function(){var html='';var i=0
while(i<12){html+='<span class="month">'+DPGlobal.dates.monthsShort[i++]+'</span>';}
this.picker.find('.datepicker-months td').append(html);},fill:function(){var d=new Date(this.viewDate),year=d.getFullYear(),month=d.getMonth(),currentDate=this.date.valueOf();this.picker.find('.datepicker-days th:eq(1)').text(DPGlobal.dates.months[month]+' '+year);var prevMonth=new Date(year,month-1,28,0,0,0,0),day=DPGlobal.getDaysInMonth(prevMonth.getFullYear(),prevMonth.getMonth());prevMonth.setDate(day);prevMonth.setDate(day-(prevMonth.getDay()-this.weekStart+7)%7);var nextMonth=new Date(prevMonth);nextMonth.setDate(nextMonth.getDate()+42);nextMonth=nextMonth.valueOf();html=[];var clsName;while(prevMonth.valueOf()<nextMonth){if(prevMonth.getDay()===this.weekStart){html.push('<tr>');}
clsName='';if(prevMonth.getMonth()<month){clsName+=' old';}else if(prevMonth.getMonth()>month){clsName+=' new';}
if(prevMonth.valueOf()===currentDate){clsName+=' active';}
html.push('<td class="day'+clsName+'">'+prevMonth.getDate()+'</td>');if(prevMonth.getDay()===this.weekEnd){html.push('</tr>');}
prevMonth.setDate(prevMonth.getDate()+1);}
this.picker.find('.datepicker-days tbody').empty().append(html.join(''));var currentYear=this.date.getFullYear();var months=this.picker.find('.datepicker-months').find('th:eq(1)').text(year).end().find('span').removeClass('active');if(currentYear===year){months.eq(this.date.getMonth()).addClass('active');}
html='';year=parseInt(year/10,10)*10;var yearCont=this.picker.find('.datepicker-years').find('th:eq(1)').text(year+'-'+(year+9)).end().find('td');year-=1;for(var i=-1;i<11;i++){html+='<span class="year'+(i===-1||i===10?' old':'')+(currentYear===year?' active':'')+'">'+year+'</span>';year+=1;}
yearCont.html(html);},click:function(e){e.stopPropagation();e.preventDefault();var target=$(e.target).closest('span, td, th');if(target.length===1){switch(target[0].nodeName.toLowerCase()){case'th':switch(target[0].className){case'switch':this.showMode(1);break;case'prev':case'next':this.viewDate['set'+DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate,this.viewDate['get'+DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate)+
DPGlobal.modes[this.viewMode].navStep*(target[0].className==='prev'?-1:1));this.fill();this.set();break;}
break;case'span':if(target.is('.month')){var month=target.parent().find('span').index(target);this.viewDate.setMonth(month);}else{var year=parseInt(target.text(),10)||0;this.viewDate.setFullYear(year);}
if(this.viewMode!==0){this.date=new Date(this.viewDate);this.element.trigger({type:'changeDate',date:this.date,viewMode:DPGlobal.modes[this.viewMode].clsName});}
this.showMode(-1);this.fill();this.set();break;case'td':if(target.is('.day')){var day=parseInt(target.text(),10)||1;var month=this.viewDate.getMonth();if(target.is('.old')){month-=1;}else if(target.is('.new')){month+=1;}
var year=this.viewDate.getFullYear();this.date=new Date(year,month,day,0,0,0,0);this.viewDate=new Date(year,month,Math.min(28,day),0,0,0,0);this.fill();this.set();this.element.trigger({type:'changeDate',date:this.date,viewMode:DPGlobal.modes[this.viewMode].clsName});}
break;}}},mousedown:function(e){e.stopPropagation();e.preventDefault();},showMode:function(dir){if(dir){this.viewMode=Math.max(this.minViewMode,Math.min(2,this.viewMode+dir));}
this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();}};$.fn.datepicker=function(option,val){return this.each(function(){var $this=$(this),data=$this.data('datepicker'),options=typeof option==='object'&&option;if(!data){$this.data('datepicker',(data=new Datepicker(this,$.extend({},$.fn.datepicker.defaults,options))));}
if(typeof option==='string')data[option](val);});};$.fn.datepicker.defaults={};$.fn.datepicker.Constructor=Datepicker;var DPGlobal={modes:[{clsName:'days',navFnc:'Month',navStep:1},{clsName:'months',navFnc:'FullYear',navStep:1},{clsName:'years',navFnc:'FullYear',navStep:10}],dates:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa","Su"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},isLeapYear:function(year){return(((year%4===0)&&(year%100!==0))||(year%400===0))},getDaysInMonth:function(year,month){return[31,(DPGlobal.isLeapYear(year)?29:28),31,30,31,30,31,31,30,31,30,31][month]},parseFormat:function(format){var separator=format.match(/[.\/\-\s].*?/),parts=format.split(/\W+/);if(!separator||!parts||parts.length===0){throw new Error("Invalid date format.");}
return{separator:separator,parts:parts};},parseDate:function(date,format){var parts=date.split(format.separator),date=new Date(),val;date.setHours(0);date.setMinutes(0);date.setSeconds(0);date.setMilliseconds(0);if(parts.length===format.parts.length){for(var i=0,cnt=format.parts.length;i<cnt;i++){val=parseInt(parts[i],10)||1;switch(format.parts[i]){case'dd':case'd':date.setDate(val);break;case'mm':case'm':date.setMonth(val-1);break;case'yy':date.setFullYear(2000+val);break;case'yyyy':date.setFullYear(val);break;}}}
return date;},formatDate:function(date,format){var val={d:date.getDate(),m:date.getMonth()+1,yy:date.getFullYear().toString().substring(2),yyyy:date.getFullYear()};val.dd=(val.d<10?'0':'')+val.d;val.mm=(val.m<10?'0':'')+val.m;var date=[];for(var i=0,cnt=format.parts.length;i<cnt;i++){date.push(val[format.parts[i]]);}
return date.join(format.separator);},headTemplate:'<thead>'+'<tr>'+'<th class="prev">&lsaquo;</th>'+'<th colspan="5" class="switch"></th>'+'<th class="next">&rsaquo;</th>'+'</tr>'+'</thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>'};DPGlobal.template='<div class="datepicker dropdown-menu">'+'<div class="datepicker-days">'+'<table class=" table-condensed">'+
DPGlobal.headTemplate+'<tbody></tbody>'+'</table>'+'</div>'+'<div class="datepicker-months">'+'<table class="table-condensed">'+
DPGlobal.headTemplate+
DPGlobal.contTemplate+'</table>'+'</div>'+'<div class="datepicker-years">'+'<table class="table-condensed">'+
DPGlobal.headTemplate+
DPGlobal.contTemplate+'</table>'+'</div>'+'</div>';}(window.jQuery);

/**
 * Combination of bootstrap datepicker and timepicker
 * @author: rolfzhang
 * @date: 2013-06-05
 * http://rolfzhang.com/
 */
$.fn.datetimePicker = function (dateOption,timeOption) {

    var datetimeRxp = /^\s*([0-9]{4,4}-[0-1]?[0-9]-[0-3]?[0-9])?\s*([0-2]?[0-9](?:\:[0-5]?[0-9]){1,2})?\s*$/,
    dateOptionDefault = {
        format: 'yyyy-mm-dd'
    },
    timeOptionDefault = {
        minuteStep: 1,
        showSeconds: true,
        showMeridian: false,
        showInputs: true
    };

    return this.each(function(){
        if($(this).attr('isDatetimePicker')){
            return;
        }

        var inputEl = this,
        wrapper = $('<div style="display:inline">'),
        name = this.name,
        val = this.value,
        split,
        tpEl = $('<div class="input-prepend" style="margin-left:5px;">\
                    <span class="add-on"><i class="icon-time"></i></span>\
                    <input class="input-small time-picker" type="text" data-bind="'+name+'"/>\
                  </div>'),
        dpEl = $('<div class="input-prepend">\
                    <span class="add-on"><i class="icon-calendar"></i></span>\
                    <input type="text" class="input-small date-picker" data-bind="'+name+'"/>\
                  </div>'),
        tpInput = tpEl.find('.time-picker'),
        dpInput = dpEl.find('.date-picker'),
        changeFn = function(){
            var result = '';
            result += dpInput.val() || '';
            result += dpInput.val()&&tpInput.val()?' ':'';
            result += tpInput.val() || '';
            inputEl.value = result;
        };
        
        wrapper.append(dpEl).append(tpEl).insertAfter(this);
        this.type = 'hidden';
        $(this).attr('isDatetimePicker','true');

        tpInput.timepicker($.extend(timeOptionDefault,timeOption));
        tpInput.change(changeFn);
        dpInput.datepicker($.extend(dateOptionDefault,dateOption));
        dpInput.blur(changeFn);

        if (val) {
            split = datetimeRxp.exec(val);
            dpInput.val(split[1]||'');
            tpInput.val(split[2]||'');
        }
    });
};
$(function(){
    $('.date-picker').datepicker({
        format: 'yyyy-mm-dd'
    });
    $('.time-picker').each(function(){
        var value = this.value;
        $(this).timepicker({
            minuteStep: 1,
            showSeconds: true,
            showMeridian: false,
            showInputs: true
        });
        $(this).val(value);
    });
    $('.datetime-picker').datetimePicker();
});