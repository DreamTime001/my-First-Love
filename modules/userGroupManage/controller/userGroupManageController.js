(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('userGroupManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $layer, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 500);
            vm.showDataMes = false;
            vm.showAlert = false;
            vm.showErrorMessage = false;
            vm.showPermissionSet = false;
            vm.erroeMessage = '';
            vm.ids = [];//存放选中的菜单id
            //查询条件
            vm.query = {
                grpNm: '',
                pageNum: 1,
                pageSize: 10
            };

            //获取列表
            vm.getPagedDataAsync = function () {
                vm.grpCd = '';
                $api.post('user/getUserGrp_1', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].crtTm ? vm.list[i].crtTm = vm.list[i].crtTm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6') : null;
                        vm.list[i].updTm ? vm.list[i].updTm = vm.list[i].updTm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6') : null;
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
                vm.grpCd = obj.grpCd;
                vm.grpNm = obj.grpNm;
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
                        vm.titleView = '新增用户组';
                        break;
                    case'edit':
                        if (vm.grpCd) {
                            vm.iconType = 'edit';
                            vm.showDataMes = true;
                            vm.titleView = '修改用户组';
                            $api.post('user/selectUserGrp_1', {grpCd: vm.grpCd}, function (result) {
                                vm.userGrpObj = result.data;
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
                vm.showPermissionSet = false;
                vm.userGrpObj = {grpNm: '', grpDsc: ''};
            };
            //新增确定按钮
            vm.toAdd = function () {
                $api.post('user/addUserGrp_1', {
                    grpNm: vm.userGrpObj.grpNm,
                    grpDsc: vm.userGrpObj.grpDsc
                }, function (result) {
                    vm.showDataMes = false;
                    vm.userGrpObj = {
                        grpNm: '',
                        grpDsc: ''
                    };//清空页面上绑定的数据
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //修改确定按钮
            vm.toEdit = function () {
                $api.post('user/updateUserGrp_1', {userGrpObj: angular.toJson(vm.userGrpObj)}, function (result) {
                    vm.showDataMes = false;
                    vm.userGrpObj = {
                        grpNm: '',
                        grpDsc: ''
                    };//清空页面上绑定的数据
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //删除框
            vm.showAlertPop = function () {
                if (vm.grpCd) {
                    vm.showAlert = true;
                } else {
                    $layer.tip('请先选择一条数据');
                }
            };
            //确定删除按钮
            vm.toDelete = function () {
                $api.post('user/deleteUserGrp_1', {
                    grpCd: vm.grpCd
                }, function (result) {
                    vm.showAlert = false;
                    $layer.tip('删除成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //权限设定框
            vm.showPermissionSetPop = function () {
                if (vm.grpCd) {
                    vm.showPermissionSet = true;
                    vm.titleView = '权限设定';
                    $api.post('user/getRoleTree_1', {grpCd: vm.grpCd}, function (result) {
                        vm.roleTree = result.data;
                    })
                } else {
                    $layer.tip('请先选择一条数据');
                }
            };
            /**
             * 权限父级切换状态
             * @param obj        当前对象
             */
            vm.changeState = function (obj) {
                obj.state == 'open' ? obj.state = 'close' : obj.state = 'open';
            };
            /**
             * 复选框单选
             * @param obj        当前对象
             *@param data        父级对象
             */
            vm.singleChk = function (obj, data) {
                vm.checkedNumber = null;
                for (var i = 0; i < data.children.length; i++) {
                    data.children[i].checked ? vm.checkedNumber++ : null
                }
                if (obj.checked) {
                    obj.checked = false;
                    vm.checkedNumber--;
                } else {
                    obj.checked = true;
                    vm.checkedNumber++;
                }
                vm.totalNumber = data.children.length;
                vm.checkedNumber == vm.totalNumber ? data.checked = true : data.checked = false;
            };
            /**
             * 复选框全选
             *@param data        父级对象
             */
            vm.allChk = function (data) {
                data.checked ? data.checked = false : data.checked = true;
                if (data.checked) {
                    for (var i = 0; i < data.children.length; i++) {
                        data.children[i].checked = true;
                    }
                } else {
                    for (var i = 0; i < data.children.length; i++) {
                        data.children[i].checked = false;
                    }
                }
            };
            //确定权限设定
            vm.toPermiss = function () {
                vm.ids = [];
                for (var i = 0; i < vm.roleTree.length; i++) {
                    for (var j = 0; j < vm.roleTree[i].children.length; j++) {
                        if (vm.roleTree[i].children[j].checked) {
                            vm.ids.push(vm.roleTree[i].children[j].id);
                            vm.roleTree[i].groupCheck = true;
                        }
                    }
                    if (vm.roleTree[i].groupCheck) {
                        vm.ids.push(vm.roleTree[i].id)
                    }
                }
                $api.post('user/roleSetup_1', {
                    ids: angular.toJson(vm.ids),
                    grpCd: vm.grpCd,
                    id: $cookies.get('id')
                }, function (result) {
                    vm.showPermissionSet = false;
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 500);
                })
            };
        }])
}());