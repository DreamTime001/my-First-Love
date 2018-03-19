(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('blacklistController', ['$api', '$timeout', '$upload', '$http', '$state', '$cookies', '$location', '$anchorScroll', '$layer','$util', function ($api, $timeout, $upload, $http, $state, $cookies, $location, $anchorScroll, $layer,$util) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.orgCd = '';//提交的ID
            vm.showPersonView = false;//信息查看弹出层
            vm.showOrgEdit = false;//移除黑名单弹出层
            vm.showListPop = false;//追踪记录弹出层
            vm.memberTitle = "";
            vm.query = {
                orgNo: '',
                type: null,
                pageNum: 1,
                pageSize: 10
            };
            //会员类型
            vm.typeList = [
                {
                    type: '0',
                    name: '个人'
                },
                {
                    type: '1',
                    name: '企业'
                }
            ];
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    orgNo: '',
                    pageNum: 1,
                    type: '',
                    pageSize: 10
                };
            };
            //黑名单移除条件
            vm.blackObj = {
                cause: '',
                orgCd: '',
                id: vm.id,
                bgnDt: '',
                endDt: ''
            };
            //追踪弹出框显示信息
            vm.listObj = {
                cmp_nm: '',
                ct: ''
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.orgCd = '';
                $api.post('org/selectOrgBlacklist', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    vm.tableTile = result.data.type;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].bgnDt = vm.list[i].bgnDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                        vm.list[i].endDt = vm.list[i].endDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
//---------------------------------------------------------------------------------------分割线--------------------------------------------------//
            //查询
            vm.submit = function () {
                if (vm.query.type) {
                    vm.query.type == 0 ? vm.currentType = 0 : vm.currentType = 1;
                    vm.getPagedDataAsync();
                }
                return $layer.tip('请选择会员类型')
            };
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.orgCd = obj.org_cd;
                vm.bgnDt = obj.bgnDt;
                vm.endDt = obj.endDt;
                vm.listObj.cmp_nm = obj.cmp_nm;
                vm.listObj.ct = obj.ct;
            };
            /*按钮查看*/
            vm.singleClick = function () {
                if (vm.orgCd) {
                    $api.post('org/selectOrgPerNoBlacklist', {
                        orgCd: vm.orgCd,
                        type: vm.currentType
                    }, function (result) {
                        vm.memberTitle = '黑名单查看';
                        vm.perInfo = result.data;
                        vm.showPersonView = true;
                    });
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            };
            /*按钮移除黑名单*/
            vm.removeClick = function () {
                vm.memberTitle = '移除黑名单';
                if (vm.orgCd) {
                    vm.showOrgEdit = true;
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            };
            //按钮移除黑名单提交
            vm.updateOrgInfo = function () {
                angular.element('.form-control').removeClass('has-error');
                vm.showErrorMessage = false;
                //原因不能为空
                if (vm.blackObj.cause == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '移除黑名单原因不能为空';
                    $util.inputFocus('cause');
                    return false
                }
                vm.erroeMessage = '';
                vm.blackObj.orgCd = vm.orgCd;
                vm.blackObj.id = $cookies.get('id');
                vm.blackObj.bgnDt = vm.bgnDt;
                vm.blackObj.endDt = vm.endDt;
                $api.post('org/removeOrgBlckLst', {blackObj: angular.toJson(vm.blackObj)}, function (result) {
                    vm.showOrgEdit = false;
                    vm.showErrorMessage = false;
                    vm.erroeMessage = '';
                    vm.blackObj.cause = '';
                    $layer.tip('黑名单移除成功',1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                });
            };
            // 追踪管理
            vm.logList = function () {
                if (vm.orgCd) {
                    $api.post('org/queryblcklstInfo', {orgCd: vm.orgCd}, function (result) {
                        vm.titleView = '追踪记录';
                        vm.popLogList = result.data;
                        vm.showListPop = true;
                    })
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            };
            //关闭层
            vm.closePop = function () {
                vm.showPersonView = false;
                vm.showOrgEdit = false;
                vm.showListPop = false;
                vm.showErrorMessage = false;
                vm.erroeMessage = '';
                vm.blackObj.cause = '';
            };
        }])
}());