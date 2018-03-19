var app = angular.module('login', ['ngCookies', 'app.config', 'app.services', 'app.layer', 'app.util']);
app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.withCredentials = false;
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' +
                        encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}]);
app.controller('loginController', ['$scope', '$cookies','$cookieStore', '$defaultConfig', '$api', '$util', '$http', '$layer','$timeout', function ($scope, $cookies,$cookieStore, $defaultConfig, $api, $util, $http, $layer,$timeout) {
    var vm = this;
    //登录用户名密码
    vm.query = {
        loginName: '',
        password: ''
    };
    vm.errorMsgIsShow = false;//报错信息是否显示
    vm.errorMsg = '';//报错内容
    //登录按钮
    vm.login = function () {
        if (!vm.query.loginName) {
            vm.errorMsgIsShow = true;
            vm.errorMsg = '请输入用户名';
            return false;
        }
        if (!vm.query.password) {
            vm.errorMsgIsShow = true;
            vm.errorMsg = '请输入用户密码';
            return false;
        }
        vm.errorMsgIsShow = false;
        $api.post('user/login', {
            loginName: vm.query.loginName,
            password: hex_md5(vm.query.password)
        }, function (result) {
            if (result.data.errorMsg) {
                vm.errorMsgIsShow = true;
                vm.errorMsg = result.data.errorMsg;
            } else {
                $cookies.put('grp_cd', result.data.grp_cd);
                $cookies.put('id', result.data.id);
                $cookies.put($defaultConfig.session_code, result.data.token);
                window.location.href = $defaultConfig.current_uri + 'index.html#/home.html';
            }
        })
    };
    //登录回车事件
    vm.loginKeyPress = function (event) {
        if (event.charCode == 13) {
            vm.login();
        }
    }
}]);