(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('userManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $layer, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showDataMes = false;
            vm.showAlert = false;
            vm.showErrorMessage = false;
            vm.showPassword = false;
            vm.erroeMessage = '';
            vm.confirmPassword = '';
            vm.password = '';
            vm.userObj = {
                sorg_cd: 88888888
            };
            //查询条件
            vm.query = {
                loginName: '',
                grpCd: '',
                pageNum: 1,
                pageSize: 10
            };
            //获取用户组数据 && 所属机构
            vm.init = function () {
                $api.get('user/getGrp', function (result) {
                    vm.getGrpList = result.data;
                });
                $api.get('user/userList', function (result) {
                    vm.getUserList = result.data;
                });
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.loginName = '';
                $api.post('user/selectUser_1', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].lgn_tm = vm.list[i].lgn_tm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //用户查询
            vm.submit = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.loginName = obj.loginName;
            };
            /**
             * 新增 || 修改 弹出层
             * @param type        add - 新增
             *                     edit - 修改
             */
            vm.showDataMesPop = function (type) {
                switch (type) {
                    case 'add':
                        vm.iconType = 'add';
                        vm.showDataMes = true;
                        vm.titleView = '新增用户';
                        break;
                    case'edit':
                        if (vm.loginName) {
                            vm.iconType = 'edit';
                            vm.showDataMes = true;
                            vm.titleView = '修改用户';
                            $api.post('user/selectUserInfo_1', {loginName: vm.loginName}, function (result) {
                                vm.userObj = result.data;
                                vm.userObj.sts ? null : vm.userObj.sts == 0;
                            })
                        } else {
                            $layer.tip('请先选择一条数据');
                        }
                        break;
                }
            };
            //关闭层
            vm.closePop = function () {
                vm.showErrorMessage = false;
                vm.erroeMessage = '';
                vm.showDataMes = false;
                vm.showAlert = false;
                vm.showPassword = false;
                vm.password = '';
                vm.confirmPassword = '';
                vm.userObj = {loginName: '', name: '', grpCd: '', mobile: '', emailAddress: '', sorg_cd: '', id: ''};
            };
            //新增确定按钮
            vm.toAdd = function () {
                vm.userObj.id = $cookies.get('id');
                $api.post('user/addUser_1', {addUserObj: angular.toJson(vm.userObj)}, function (result) {
                    vm.showDataMes = false;
                    vm.userObj = {
                        loginName: '',
                        name: '',
                        grpCd: '',
                        mobile: '',
                        emailAddress: '',
                        sorg_cd: '',
                        id: ''
                    };//清空页面上绑定的数据
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //修改确定按钮
            vm.toEdit = function () {
                vm.userObj.id = $cookies.get('id');
                $api.post('user/updateUser_1', {updUserObj: angular.toJson(vm.userObj)}, function (result) {
                    vm.showDataMes = false;
                    vm.userObj = {
                        loginName: '',
                        name: '',
                        grpCd: '',
                        mobile: '',
                        emailAddress: '',
                        sorg_cd: '',
                        id: ''
                    };//清空页面上绑定的数据
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //删除框
            vm.showAlertPop = function () {
                if (vm.loginName) {
                    vm.showAlert = true;
                } else {
                    $layer.tip('请先选择一条数据');
                }
            };
            //确定删除按钮
            vm.toDelete = function () {
                $api.post('user/deleteUserInfo_1', {
                    loginName: vm.loginName,
                    id: $cookies.get('id')
                }, function (result) {
                    vm.showAlert = false;
                    $layer.tip('删除成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };

            //修改密码框
            vm.showPasswordPop = function () {
                if (vm.loginName) {
                    vm.showPassword = true;
                } else {
                    $layer.tip('请先选择一条数据');
                }
            };
            //确定修改密码
            vm.toPassword = function () {
                $api.post('user/restPassword_1', {
                    loginName: vm.loginName,
                    password: hex_md5(vm.password)
                }, function (result) {
                    vm.showPassword = false;
                    $layer.tip('修改成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
        }])
}());