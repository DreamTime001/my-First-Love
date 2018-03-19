(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('dataDictionaryController', ['$api', '$timeout', '$upload', '$http', '$state', '$cookies', '$layer', function ($api, $timeout, $upload, $http, $state, $cookies, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showDataMes = false;
            vm.showAlert = false;
            vm.showErrorMessage = false;
            vm.erroeMessage = '';
            //查询条件
            vm.query = {
                category: '',
                numberVal: '',
                name: '',
                pageNum: 1,
                pageSize: 10
            };
            //系统
            vm.sysCategoryList = [
                {
                    sysCategory: '0',
                    name: '前台'
                },
                {
                    sysCategory: '1',
                    name: '后台'
                }
            ];
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.sid = '';
                $api.post('data/searchDic_1', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    if (vm.list) {
                        for (var i = 0; i < vm.list.length; i++) {
                            vm.list[i].sysCategory == 0 ? vm.list[i].sysCategory = '前台' : vm.list[i].sysCategory = '后台'
                        }
                    }
                    vm.query.pages = result.data.pages;
                })
            };
//----------------------------------------------------------------------------分割线-------------------------------------------------------------------------------------------//
            //查询
            vm.submit = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    category: '',
                    numberVal: '',
                    name: '',
                    pageNum: 1,
                    pageSize: 10
                }
            };
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.sid = obj.sid;
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
                        vm.titleView = '新增数据';
                        break;
                    case'edit':
                        if (vm.sid) {
                            vm.iconType = 'edit';
                            vm.showDataMes = true;
                            vm.titleView = '修改数据';
                            $api.post('data/selectByNameDic_1', {sid: vm.sid}, function (result) {
                                vm.dicObj = result.data;
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
                vm.dicObj = {sysCategory: '', category: '', numberVal: '', zcName: '', desc: ''};
            };
            //新增确定按钮
            vm.toAdd = function () {
                vm.dicObj.id = $cookies.get('id');
                $api.post('data/addDicInfo_1', {addDicObj: angular.toJson(vm.dicObj)}, function (result) {
                    vm.showDataMes = false;
                    vm.dicObj = {sysCategory: '', category: '', numberVal: '', zcName: '', desc: ''};//清空页面上绑定的数据
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //修改确定按钮
            vm.toEdit = function () {
                vm.dicObj.id = $cookies.get('id');
                vm.dicObj.sid = vm.sid;
                $api.post('data/updateDicInfo_1', {updDicObj: angular.toJson(vm.dicObj)}, function (result) {
                    vm.showDataMes = false;
                    vm.dicObj = {sysCategory: '', category: '', numberVal: '', zcName: '', desc: ''};//清空页面上绑定的数据
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //删除框
            vm.showAlertPop = function () {
                if (vm.sid) {
                    vm.showAlert = true;
                } else {
                    $layer.tip('请先选择一条数据');
                }
            };
            //确定删除按钮
            vm.toDelete = function () {
                $api.post('data/deleteDic_1', {sid: vm.sid}, function (result) {
                    vm.showAlert = false;
                    $layer.tip('删除成功');
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 500);
                })
            };
        }])
}());