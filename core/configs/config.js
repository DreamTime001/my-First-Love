(function() {
	"use strict";
	angular.module('app.config', [])
		.constant('$defaultConfig', {
			//后台应用URI
			app_uri: '',
			//当前的URI
			current_uri: '',
            // current_uri: 'http://127.0.0.1:8020',
			//登录失效CODE
			session_timeout_code: "10014",
			//session_code
			session_code: 'token',
			//请求头TokenCode
			header_token_code: 'token'
		})
}());