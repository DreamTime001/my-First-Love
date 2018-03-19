(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('trackingManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$layer', function ($api, $timeout, $upload, $http, $state, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.orgCd = '';//提交的ID
            vm.showListtrack = false;//跟踪记录查看弹出层
            vm.query = {
                type: null,
                prvnc: '',
                city: '',
                creatTime: '',
                orgNameOrStnm: '',
                pageNum: 1,
                pageSize: 10
            };
            //省
            $api.get('org/getPrvnc', function (result) {
                vm.prvncList = result.data.list;
            });
            //市
            vm.getSelect = function (selected) {
                if (selected) {
                    $api.post('org/getCity', {province: selected}, function (result) {
                        vm.provinceList = result.data.list;
                    });
                }
            };
            /*会员类型*/
            vm.typeList = [
                {
                    name: '个人',
                    type: '0'
                },
                {
                    name: '企业',
                    type: '1'
                }
            ];
            /*访问时间*/
            vm.creatTimeList = [
                {
                    name: '一周',
                    type: '1'
                },
                {
                    name: '两周',
                    type: '2'
                },
                {
                    name: '三周',
                    type: '3'
                },
                {
                    name: '一个月以内   ',
                    type: '4'
                }
            ];
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.orgCd = obj.orgCd;//获取orgCD
                vm.stName = obj.stName;
                vm.cityList = obj.cityList;
                vm.logName = obj.logName;
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.orgCd = '';
                $api.post('service/selectServiceTrace_1', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    vm.query.type == 0 ? vm.currentType = 0 : vm.currentType = 1;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].crTime = vm.list[i].crTime.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
            //查询
            vm.submit = function () {
                if (vm.query.type) {
                    vm.getPagedDataAsync();
                } else {
                    return $layer.tip('请选择会员类型');
                }
            };
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    type: null,
                    prvnc: '',
                    city: '',
                    creatTime: '',
                    orgNameOrStnm: '',
                    pageNum: 1,
                    pageSize: 10
                };
            };
            //跟踪记录
            vm.trackList = function () {
                if (vm.orgCd) {
                    if (vm.currentType == 0) {
                        $api.post('service/selectByOrgCdTrace_1', {orgCd: vm.orgCd}, function (result) {
                            vm.titleView = '个人跟踪详情页';
                            vm.trackperInfo = result.data;
                            if (vm.trackperInfo) {
                                for (var i = 0; i < vm.trackperInfo.length; i++) {
                                    vm.trackperInfo[i].optDate = vm.trackperInfo[i].optDate.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                                }
                            }
                            vm.showListtrack = true;
                        })
                    }
                    if (vm.currentType == 1) {
                        $api.post('service/selectByOrgCdTrace_1', {orgCd: vm.orgCd}, function (result) {
                            vm.titleView = '企业跟踪详情页';
                            vm.trackperInfo = result.data;
                            if (vm.trackperInfo) {
                                for (var i = 0; i < vm.trackperInfo.length; i++) {
                                    vm.trackperInfo[i].optDate = vm.trackperInfo[i].optDate.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                                }
                            }
                            vm.showListtrack = true;
                        })
                    }
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            };
            //关闭
            vm.closePop = function () {
                vm.showListtrack = false;//跟踪记录查看弹出层
            };
        }])
}());