(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('serviceOrgManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$layer', '$scope', '$cookies', '$util', function ($api, $timeout, $upload, $http, $state, $layer, $scope, $cookies, $util) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showDataMes = false;
            vm.showAlert = false;
            vm.showErrorMessage = false;
            vm.showPassword = false;
            vm.showBlack = false;
            vm.showBranch = false;
            vm.erroeMessage = '';
            //查询条件
            vm.query = {
                prvnc: '',
                citys: '',
                isBlckLst: '',
                orgName: '',
                pageNum: 1,
                pageSize: 10
            };
            //是否黑名单
            vm.isBlackLists = [
                {
                    isBlckLst: 0,
                    name: '否'
                },
                {
                    isBlckLst: 1,
                    name: '是'
                }
            ];
            //获取省
            vm.getPrvnc = function () {
                $api.get('org/getPrvnc', function (result) {
                    vm.prvncList = result.data.list;
                });
            };
            //获取市
            vm.getSelect = function (selected) {
                if (selected) {
                    $api.post('org/getCity', {province: selected}, function (result) {
                        vm.province = result.data.list;
                    });
                }
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.orgCd = '';
                $api.post('3partSrvcOrg/selectThreeServiceOrg_1', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].blckLstDate ? vm.list[i].blckLstDate = vm.list[i].blckLstDate.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6') : null;
                    }
                    vm.query.pages = result.data.pages;
                })
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //时间差
            vm.startToEnd = function (start, end) {
                var startDate = new Date(start);  //开始时间
                var endDate = new Date(end);    //结束时间
                var surplusDate = endDate.getTime() - startDate.getTime();  //时间差的毫秒数
                var days = surplusDate / 1000 / 60 / 60 / 24;
                return days
            };
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
                vm.orgCd = obj.org_cd;
                vm.isOrForCode = obj.isOrForCode;
                vm.sid = obj.sid;
            };
            /**
             * 新增 || 修改 弹出层
             * @param type        add - 新增
             *                     edit - 修改
             *                     addBlack - 加入黑名单
             *                     removeBlack - 移除黑名单
             *                     delete - 删除
             */
            vm.showPubPop = function (type) {
                switch (type) {
                    case 'add':
                        vm.iconType = 'add';
                        vm.showDataMes = true;
                        vm.titleView = '新增账户';
                        $api.get('3partSrvcOrg/queryThreeeService_1', function (result) {
                            vm.serverList = result.data;
                        });
                        break;
                    case'edit':
                        if (vm.orgCd) {
                            vm.iconType = 'edit';
                            vm.showDataMes = true;
                            vm.titleView = '修改账户';
                            $api.post('3partSrvcOrg/queryThreeServiceOrg_1', {org_cd: vm.orgCd}, function (result) {
                                $api.get('3partSrvcOrg/queryThreeeService_1', function (result) {
                                    vm.serverList = result.data;
                                });
                                vm.trackEditObj = result.data;
                                $api.post('org/getCity', {province: vm.trackEditObj.prvnc}, function (result) {
                                    vm.province = result.data.list;
                                });
                            });
                        } else {
                            $layer.tip('请先选择一条数据');
                        }
                        break;
                    case 'addBlack':
                        if (vm.orgCd) {
                            if (vm.isOrForCode == '0') {
                                vm.showBlack = true;
                                vm.titleView = '加入黑名单';
                                //日期初始化
                                $timeout(function () {
                                    var toDay = new Date();
                                    initDate('#startDate', 'yyyy-mm-dd', 2, function (date) {
                                        $('#endDate').datetimepicker('setStartDate', date);
                                        var start = $('#startDate').val();
                                        var end = $('#endDate').val();
                                        if (start && end) {
                                            $scope.$apply(function () {
                                                vm.distanceTime = vm.startToEnd(start, end);
                                            });
                                        }
                                    }, toDay);
                                    initDate('#endDate', 'yyyy-mm-dd', 2, function (date) {
                                        $('#startDate').datetimepicker('setEndDate', date);
                                        var start = $('#startDate').val();
                                        var end = $('#endDate').val();
                                        if (start && end) {
                                            $scope.$apply(function () {
                                                vm.distanceTime = vm.startToEnd(start, end);
                                            });
                                        }
                                    }, toDay)
                                }, 500);
                            } else {
                                $layer.tip('已加入黑名单');
                            }
                        } else {
                            $layer.tip('请先选择一条数据');
                        }
                        break;
                    case 'removeBlack':
                        if (vm.orgCd) {
                            if (vm.isOrForCode == '1') {
                                vm.iconType = 'remove';
                                vm.showAlert = true;
                            } else {
                                $layer.tip('未加入黑名单');
                            }
                        } else {
                            $layer.tip('请先选择一条数据');
                        }
                        break;
                    case'branch':
                        if (vm.orgCd) {
                            vm.showBranch = true;
                            vm.titleView = '分支机构账户';
                            $api.post('3partSrvcOrg/selectThirdServiceBranchList_1', {org_cd: vm.orgCd}, function (result) {
                                if (result.trackEditObj) {
                                    vm.branchList = result.trackEditObj;
                                    for (var i = 0; i < vm.branchList.length; i++) {
                                        vm.getBranchCity(vm.branchList[i]);
                                    }
                                } else {
                                    vm.branchList = [{
                                        li: '',
                                        chid_prvnc: '',
                                        chid_ct: '',
                                        chid_per: '',
                                        chid_tel: '',
                                        sid: '',
                                        chid_ctList: []
                                    }]
                                }
                            })
                        } else {
                            $layer.tip('请先选择一条数据');
                        }
                        break;
                    case 'delete':
                        if (vm.orgCd) {
                            vm.iconType = 'delete';
                            vm.showAlert = true;
                            vm.titleView = '确认删除吗？'
                        } else {
                            $layer.tip('请先选择一条数据');
                        }
                        break;
                }
            };
            /**
             * 获取分支机构市数据
             * @param obj        当前对象
             */
            vm.getBranchCity = function (obj) {
                $api.post('org/getCity', {province: obj.chid_prvnc}, function (result) {
                    obj.chid_ctList = result.data.list;
                });
            };
            //添加分支机构
            vm.addBranch = function () {
                vm.branchList.push({
                    li: '',
                    chid_prvnc: '',
                    chid_ct: '',
                    chid_per: '',
                    chid_tel: '',
                    sid: '',
                    chid_ctList: []
                })
            };
            /**
             * 删除分支机构
             * @param index      当前用户的下标
             *         sid        当前用户的sid
             */
            vm.deleteBranch = function (index, sid) {
                vm.branchList.splice(index, 1);
                if (sid) {
                    $api.post('3partSrvcOrg/deleThreeServiceBranchOrg_1', {sid: sid}, function (result) {
                        return $layer.tip('删除成功');
                    });
                }
                $layer.tip('删除成功');
            };
            //关闭
            vm.closePop = function () {
                vm.showErrorMessage = false;
                vm.erroeMessage = '';
                vm.showDataMes = false;
                vm.showAlert = false;
                vm.showBlack = false;
                vm.showBranch = false;
            };
            //新增确定按钮
            vm.toAdd = function () {
                $api.post('3partSrvcOrg/addThreeServiceOrg_1', {trackEditObj: angular.toJson(vm.trackEditObj)}, function (result) {
                    vm.showDataMes = false;
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //修改确定按钮
            vm.toEdit = function () {
                $api.post('3partSrvcOrg/updateThreeServiceOrg_1', {trackEditObj: angular.toJson(vm.trackEditObj)}, function (result) {
                    vm.showDataMes = false;
                    $layer.tip('修改成功', 1000);
                    vm.orgCd = '';
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //加入黑名单确认按钮
            vm.toAddBlack = function () {
                angular.element('.form-control').removeClass('has-error');
                if (vm.blackInfObj.startDate == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '开始时间不能为空';
                    $util.inputFocus('startDate');
                    return false
                }
                if (vm.blackInfObj.endDate == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '结束时间不能为空';
                    $util.inputFocus('endDate');
                    return false
                }
                if (vm.blackInfObj.rvwInf == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '加入原因不能为空';
                    $util.inputFocus('rvwInf');
                    return false
                }
                vm.showErrorMessage = false;
                vm.erroeMessage = '';
                vm.blackInfObj.org_cd = vm.orgCd;
                $api.post('org/addOrgBlacklist_1', {trackEditObj: angular.toJson(vm.blackInfObj)}, function (result) {
                    vm.showBlack = false;
                    vm.distanceTime = null;
                    vm.blackInfObj.startDate = '';
                    vm.blackInfObj.endDate = '';
                    $layer.tip('加入黑名单成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                });
            };
            //移除黑名单确认按钮
            vm.toRemoveBlack = function () {
                $api.post('3partSrvcOrg/removeBlckLst_1', {
                    org_cd: vm.orgCd,
                    id: $cookies.get('id')
                }, function (result) {
                    vm.showAlert = false;
                    $layer.tip('移除成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                });
            };
            //删除服务
            vm.toDeleServers = function () {
                $api.post('3partSrvcOrg/deleteThreeServiceOrg_1', {
                    org_cd: vm.orgCd
                }, function (result) {
                    vm.showAlert = false;
                    $layer.tip('删除成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                });
            };
            //分支机构账户确定按钮
            vm.toBranch = function () {
                for (var i = 0; i < vm.branchList.length; i++) {
                    delete vm.branchList[i].chid_ctList;
                }
                $api.post('3partSrvcOrg/addThreeServiceBranchOrg_1', {
                    trackEditObj: angular.toJson(vm.branchList),
                    id: $cookies.get('id'),
                    org_cd: vm.orgCd
                }, function (result) {
                    vm.showBranch = false;
                    vm.branchList = [{
                        li: '',
                        chid_prvnc: '',
                        chid_ct: '',
                        chid_per: '',
                        chid_tel: '',
                        sid: ''
                    }];
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                });
            };
        }])
}());