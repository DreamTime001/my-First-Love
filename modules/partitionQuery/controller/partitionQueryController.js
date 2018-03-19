(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('partitionQueryController', ['$api', '$timeout', '$upload', '$http', '$state', '$cookies', function ($api, $timeout, $upload, $http, $state, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            //查询条件
            vm.query = {
                astNames: '',
                shrSts: '',
                startDate: '',
                endDate: '',
                id: $cookies.get('id'),
                pageNum: 1,
                pageSize: 10
            };
            //状态
            vm.shrStsList = [
                {
                    shrSts: 0,
                    name: '已打款'
                },
                {
                    shrSts: 1,
                    name: '未打款'
                },
                {
                    shrSts: 9,
                    name: '打款失败'
                }
            ];
            //获取列表
            vm.getPagedDataAsync = function () {
                $api.post('trans/getDivideList', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].crt_tm = vm.list[i].crt_tm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
            //日期初始化
            initDate('#startDate', 'yyyy-mm-dd', 2, function (date) {
                $('#endDate').datetimepicker('setStartDate', date);
            });
            initDate('#endDate', 'yyyy-mm-dd', 2, function (date) {
                $('#startDate').datetimepicker('setEndDate', date);
            });
//------------------------------------------------------------------分割线---------------------------------------------------//
            //查询
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
            };
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    astNames: '',
                    shrSts: '',
                    startDate: '',
                    endDate: '',
                    pageNum: 1,
                    pageSize: 10
                };
            };
        }])
}());