/**
* 重写alert
* @param str : alertx显示信息       类型: string
* @param time: alert显示时间 	    类型: number			
* @param type: alert的类型			类型: string		
*/
;(function(window, undefined) {

	var alertObj = {
		"_is_load": false,
		"_timer": null,
		"showAlertBox": function(params) {
			if(!this._is_load) {
				var style = [];
				style.push('top: 0');
				style.push('left:0');
				style.push('z-index:9999999999');
				style.push('padding:5px 10px');
				style.push('min-width:300px');
				style.push('height:40px');
				style.push('line-height:30px');
				style.push('border-radius:0 0 4px 4px');
				style.push('font-size:16px');
				style.push('color:#FFF');
				style.push('box-sizing:border-box');
				style.push('position:fixed');
				style.push('text-align:center');

				this.$obj = $('<div style="'+style.join(';')+'"></div>');
				$('body').append(this.$obj);
				this._is_load = true;
				this.doEvent(params);
			}else {
				this.doEvent(params);
			}
		},
		"doEvent": function(params) {
			var _this = this
			if(this.timer) {
				clearTimeout(this.timer);
			} 

			this.$obj.html(params.str).css({
				'left': parseInt(($(window).width()/2) - (this.$obj.width()/2)),
				'background': params.type == 'ok' ? '#dff0d8' : '#bcdff1',
				'border': params.type == 'ok' ? '#d0e9c6' : '#bcdff1',
				'color': params.type == 'ok' ? '#3c763d' : '#31708f'
			}).fadeIn(500).hover(function() {
				clearTimeout(_this.timer);
			}, function(){
				_this.timer = setTimeout(function() {
					_this.$obj.fadeOut(500);
				}, params.time ? params.time:2000);
			});
			this.timer = setTimeout(function(){
				_this.$obj.fadeOut(500);
			}, params.time ? params.time:2000);
		}
	}


	window.alert = function(str, time, type) {//window.alert定义全局变量兼容IE8
		var params = $.extend({
			"str": "",
			"time": 2000,
			"type": "ok"
		}, {
			"str": str,
			"time": time,
			"type": type
		})
		alertObj.showAlertBox(params);
	}
})(window);