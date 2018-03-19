//小吕 http://192.168.0.125:9095
//小丁 http://192.168.0.128:9091
//小赵 http://192.168.1.63:9092
//小青 http://192.168.1.26:9090


(function() {
	"use strict";
	angular.module('app.config', [])
		.constant('$defaultConfig', {
			//后台应用URI
			app_uri: 'http://192.168.0.128:9091/fund-trade-admin/',
			//当前的URI
			current_uri: '/非标后台/',
			//登录失效CODE
			session_timeout_code: 203,
			//session_code
			session_code: 'token',
			//请求头TokenCode
			header_token_code: 'token'
		})
}());