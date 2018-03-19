(function () {
    'use strict';
    angular.module('app.controllers', ['ngCookies','angularFileUpload','ueditor.directive'])
    // 首页
        .controller('indexController', ['$state', '$cookies', '$timeout', '$api', '$defaultConfig', '$location', '$filter', '$http', function ($state, $cookies, $timeout, $api, $defaultConfig, $location, $filter, $http) {
            var vm = this;
            vm.usrInfor = {};//用户信息
            vm.grp_cd = $cookies.get('grp_cd');//获取用户组
            vm.id = $cookies.get('id');//获取用户Id
            //默认加载左侧导航和个人信息
            vm.init = function () {
                $api.post('user/getMenu', {grp_cd: vm.grp_cd, id: vm.id}, function (result) {
                    vm.usrInfor.usrName = result.data.usrName;
                    vm.usrInfor.lastLogin = result.data.lastLogin.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');
                    vm.menuList = result.data.menuList;
                    $timeout(function () {
                        initMenu();
                        menuClick();
                    }, 100);
                });
            };
            //登出
            vm.logout = function () {
                $api.post('user/exit',{id:vm.id}, function (result) {
                    var getCookies = $cookies.getAll();//获取所有cooikes的值
                    //循环删除
                    angular.forEach(getCookies, function (v, k) {
                        $cookies.remove(k);
                    });
                    // $cookies.remove('grp_cd', '');
                    // $cookies.remove("grp_cd");
                    // $cookies.remove("id");
                    window.location.href = $defaultConfig.current_uri + 'login.html';
                });
            }
        }])
        .controller('modifyController', function ($api) {
            var vm = this;
        });
}());