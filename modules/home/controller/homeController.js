(function() {
	'use strict';
	angular.module('app.controllers')
		// 首页
		.controller('homeController', ['$api','$timeout','$cookies', function($api, $timeout,$cookies) {
		    var vm = this;
            $timeout(function () {
                homeMenu();
            }, 100);

			//获取右侧入口
            $api.post('user/getIndexMenu', {grp_cd: $cookies.get('grp_cd')}, function (result) {
                vm.indexList = result.data.indexList;
            })
        }])
}());