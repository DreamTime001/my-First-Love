(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('assetAuditController', ['$api', '$timeout', '$upload', '$http', '$state', '$location', '$anchorScroll', '$cookies', '$layer', '$util', function ($api, $timeout, $upload, $http, $state, $location, $anchorScroll, $cookies, $layer, $util) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showAssetView = false;//资产查看弹出层
            vm.titleView = '';//弹出层标题
            vm.showPersonView = false;//个人信息查看弹出层
            vm.showOrgView = false;//企业信息查看弹出层
            vm.showListPop = false;//列表弹出层
            vm.showShelvesPop = false;//上架弹出层
            vm.showShelfPop = false;//下架弹出层
            vm.showExaminePop = false;//审核弹出层
            vm.showErrorMessage = false;//报错信息
            vm.id = $cookies.get('id');//获取Id
            //查询条件
            vm.query = {
                prvnc: '',
                city: '',
                reviewType: '',
                reviewState: '',
                startDate: '',
                endDate: '',
                orgAndpj: '',
                pageNum: 1,
                pageSize: 10
            };
            //上架条件
            vm.shelvesObj = {
                posid: 0,
                st_cd: '',
                rcmnd: 1,
                reviewType: 1,
                id: vm.id
            };
            //下架条件
            vm.shelfObj = {
                posid: 1,
                st_cd: '',
                reviewType: 1,
                id: vm.id
            };
            //审核条件
            vm.examineObj = {
                stsDesc: '',
                st_cd: '',
                reviewType: '',
                statuesId: '',
                id: vm.id
            };
            //获取省
            vm.getPrvnc = function () {
                $api.get('org/getPrvnc', function (result) {
                    vm.prvnc = result.data.list;
                    vm.prvncEdit = result.data.list;
                });
            };
            /**
             * 获取市的相关信息
             * @param selected    所选中的省份id
             * @param type        判断是哪个下拉框 page,pop
             */
            vm.getSelect = function (selected, type) {
                if (selected) {
                    $api.post('org/getCity', {province: selected}, function (result) {
                        switch (type) {
                            case 'page':
                                vm.province = result.data.list;
                                break;
                            case 'pop':
                                vm.provinceEdit = result.data.list;
                                break;
                        }
                    });
                }
            };
            //资产分类
            vm.assetClass = [
                {
                    reviewType: 1,
                    name: '一般金融资产'
                },
                {
                    reviewType: 9,
                    name: '要约交易'
                }
            ];
            //审核状态
            vm.reviewStateList = [
                {
                    reviewState: '1',
                    name: '审核中'
                },
                {
                    reviewState: '0',
                    name: '审核通过'
                },
                {
                    reviewState: 'P',
                    name: '议价中'
                },
                {
                    reviewState: '5',
                    name: '已下单'
                }
            ];
            //日期初始化
            initDate('#startDate', 'yyyy-mm-dd', 2, function (date) {
                $('#endDate').datetimepicker('setStartDate', date);
            });
            initDate('#endDate', 'yyyy-mm-dd', 2, function (date) {
                $('#startDate').datetimepicker('setEndDate', date);
            });
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.orgCd = '';
                vm.stCd = '';
                if (vm.query.reviewType) {
                    vm.query.reviewType == 1 ? vm.ty = 1 : vm.ty = 9;
                    $api.post('asset/reviewList', {query: angular.toJson(vm.query)}, function (result) {
                        vm.list = result.data.list;
                        for (var i = 0; i < vm.list.length; i++) {
                            vm.list[i].checked = false;//添加默认选中状态
                            vm.list[i].crt_tm = vm.list[i].crt_tm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                        }
                        vm.query.pages = result.data.pages;
                    })
                } else {
                    return $layer.tip('请选择资产分类')
                }
            };
//----------------------------------------------------------------------------------------------------分割线-------------------------------------------------------------//
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    prvnc: '',
                    city: '',
                    reviewType: '',
                    reviewState: '',
                    startDate: '',
                    endDate: '',
                    orgAndpj: '',
                    pageNum: 1,
                    pageSize: 10
                };
            };
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.st_cd = obj.st_cd;
                vm.orgCd = obj.org_cd;
                vm.idFlag = obj.id_flag;
                vm.stCd = obj.st_cd;
                vm.onSl = obj.on_sl;//上下架状态 1-下架 0-上架
                vm.statues = obj.statues//审核状态
            };
            //查询
            vm.submit = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //关闭层
            vm.closePop = function () {
                vm.showAssetView = false;
                vm.showOrgView = false;
                vm.showPersonView = false;
                vm.showListPop = false;
                vm.showShelvesPop = false;
                vm.showShelfPop = false;
                vm.showExaminePop = false;
                vm.erroeMessage = false;
                vm.showErrorMessage = false;
            };
            //资产查看
            vm.assetView = function () {
                if (vm.orgCd) {
                    $api.post('asset/getAsset', {st_cd: vm.st_cd, ty: vm.ty}, function (result) {
                        vm.titleView = '资产信息';
                        vm.assetData = result.data;
                        vm.showAssetView = true;
                    })
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
            //查看
            vm.view = function () {
                if (vm.orgCd) {
                    $api.post('org/checkOrgInfo', {orgCd: vm.orgCd}, function (result) {
                        if (vm.idFlag == '2') {
                            vm.showPersonView = true;
                            vm.titleView = '个人信息查看';
                            vm.perInfo = result.data.userGrp;
                        } else {
                            vm.titleView = '企业信息查看';
                            vm.orgInfo = result.data.userGrp;
                            vm.orgInfo.staus == 0 ? vm.orgInfo.staus = '是' : vm.orgInfo.staus = '否';
                            vm.showOrgView = true;
                        }
                    })
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
            // 日志查看
            vm.logList = function () {
                if (vm.stCd) {
                    $api.post('asset/reviewlog', {st_cd: vm.stCd, type: vm.ty}, function (result) {
                        vm.titleView = '日志查看';
                        vm.popLogList = result.data;
                        for (var i = 0; i < vm.popLogList.length; i++) {
                            vm.popLogList[i].crt_tm = vm.popLogList[i].crt_tm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                        }
                        vm.showListPop = true;
                    })
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            }
            //上架弹层
            vm.shelves = function () {
                if (vm.orgCd) {
                    if (vm.onSl == 1) {
                        vm.showShelvesPop = true;
                        vm.titleView = '上架'
                    } else {
                        return $layer.tip('只有下架状态才可以操作');
                    }
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
            //确认上架
            vm.toShelves = function () {
                vm.shelvesObj.st_cd = vm.stCd;
                vm.shelvesObj.reviewType = vm.ty;
                $api.post('asset/reviewput', {shelvesObj: angular.toJson(vm.shelvesObj)}, function (result) {
                    vm.showShelvesPop = false;
                    $layer.tip('上架成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //下架弹层
            vm.shelf = function () {
                if (vm.orgCd) {
                    if (vm.onSl == 0) {
                        vm.showShelfPop = true;
                        vm.titleView = '下架'
                    } else {
                        return $layer.tip('只有上架状态才可以操作');
                    }
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
            //确认下架
            vm.toShelf = function () {
                vm.shelfObj.st_cd = vm.stCd;
                vm.shelfObj.reviewType = vm.ty;
                $api.post('asset/reviewsold', {shelfObj: angular.toJson(vm.shelfObj)}, function (result) {
                    vm.showShelfPop = false;
                    $layer.tip('下架成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //审核弹层
            vm.examine = function () {
                if (vm.orgCd) {
                    if (vm.statues == 1) {
                        vm.titleView = '审核';
                        vm.showExaminePop = true;
                    } else {
                        return $layer.tip('只有审核中状态才可以操作');
                    }
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
            /**
             * 审核&&驳回
             * @param id    获得焦点的id
             */
            vm.toExamine = function (doing) {
                if (vm.examineObj.stsDesc == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '审核意见不能为空';
                    $util.inputFocus('stsDesc');
                    return false;
                }
                vm.examineObj.st_cd = vm.stCd;
                vm.examineObj.reviewType = vm.ty;
                switch (doing) {
                    case 'examine':
                        vm.examineObj.statuesId = 0;
                        $api.post('asset/reviewsave', {examineObj: angular.toJson(vm.examineObj)}, function (result) {
                            vm.showErrorMessage = false;
                            vm.erroeMessage = '';
                            vm.showExaminePop = false;
                            vm.examineObj.stsDesc = '';
                            $layer.tip('审核成功', 1000);
                            $timeout(function () {
                                vm.getPagedDataAsync();
                            }, 1000);
                        });
                        break;
                    case'reject':
                        vm.examineObj.statuesId = 2;
                        $api.post('asset/reject', {examineObj: angular.toJson(vm.examineObj)}, function (result) {
                            vm.showErrorMessage = false;
                            vm.erroeMessage = '';
                            vm.showExaminePop = false;
                            vm.examineObj.stsDesc = '';
                            $layer.tip('已驳回', 1000);
                            $timeout(function () {
                                vm.getPagedDataAsync();
                            }, 1000);
                        });
                        break;
                }
            };
        }])
}());