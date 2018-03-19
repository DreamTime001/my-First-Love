(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('unMembersListController', ['$api', '$timeout', '$upload', '$http', '$state', function ($api, $timeout, $upload, $http, $state) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.id = '';//提交的ID
            vm.query = {
                creatTime: 0,
                mobile: '',
                auditType: null,
                pageNum: 1,
                pageSize: 10
            };
            //会员类型
            vm.memberType = [
                {
                    name: '个人',
                    type: 0
                },
                {
                    name: '企业',
                    type: 1
                }
            ];
            //创建时间
            vm.createTimeArry = [
                {
                    name: '一周',
                    creatTime: 1
                },
                {
                    name: '一个月以内',
                    creatTime: 2
                },
                {
                    name: '三个月以内',
                    creatTime: 3
                },
                {
                    name: '三个月以上',
                    creatTime: 4
                }
            ];
            //查询
            vm.submit = function () {
                if (vm.query.auditType == null) {
                    return layer.alert('请选择会员类型')
                }
                $http({
                    method: 'GET',
                    url: 'json/unMemberList.json'
                }).success(function (result, header, config, status) {
                    vm.id == '';
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].crt_tm = vm.list[i].crt_tm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                });
            };
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.id = obj.org_cd;
            };
            /**
             * 统一按钮
             * @param doing    事件(包括查看、编辑等)
             */
            vm.singleClick = function (doing) {
                if (vm.id == '') {
                    return layer.msg('请选择至少选择一个会员进行操作');
                }
                switch (doing) {
                    case 'view':
                        console.log('view' + vm.id);
                        break;
                    case 'edit':
                        console.log('edit' + vm.id);
                        break;
                    case 'track':
                        console.log('track' + vm.id);
                        break;
                }
            };
        }])
}());