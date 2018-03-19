(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('assetOrderController', ['$api', '$timeout', '$upload', '$http', '$state', '$cookies', '$location', '$anchorScroll', '$util','$layer', function ($api, $timeout, $upload, $http, $state, $cookies, $location, $anchorScroll, $util,$layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showCancelOrdPop = false;//取消订单层
            vm.showAssetView = false;//资产查看弹出层
            vm.showAlertPop = false;//确认框
            vm.showOrgView = false;//机构查看
            vm.showPersonView = false;//个人查看
            vm.showTransView = false;//交易信息
            vm.id = $cookies.get('id');
            //查询条件
            vm.query = {
                sts: '',
                st_nm: '',
                tp: '',
                trns_ty: '',
                beginDate: '',
                endDate: '',
                pageNum: 1,
                pageSize: 10
            };
            //资产类型
            vm.tpList = [
                {
                    tp: '1',
                    name: '住宅'
                },
                {
                    tp: '2',
                    name: '写字楼'
                },
                {
                    tp: '3',
                    name: '酒店'
                },
                {
                    tp: '4',
                    name: '商铺'
                },
                {
                    tp: '5',
                    name: '厂房'
                },
                {
                    tp: '6',
                    name: '土地'
                },
                {
                    tp: '7',
                    name: '综合体'
                }
            ];
            //转让方式
            vm.trns_tyList = [
                {
                    trns_ty: '1',
                    name: '整体转让'
                },
                {
                    trns_ty: '3',
                    name: '部分转让'
                }
            ];
            //订单状态
            vm.stsList = [
                {
                    sts: '0',
                    name: '已完成'
                },
                {
                    sts: '1',
                    name: '未签署'
                },
                {
                    sts: '2',
                    name: '已签署未打款'
                },
                {
                    sts: '3',
                    name: '已签署部分打款'
                },
                {
                    sts: '9',
                    name: '已取消'
                },
                {
                    sts: 'P',
                    name: '议价中'
                }
            ];
            //日期初始化
            initDate('#beginDate', 'yyyy-mm-dd', 2, function (date) {
                $('#endDate').datetimepicker('setStartDate', date);
            });
            initDate('#endDate', 'yyyy-mm-dd', 2, function (date) {
                $('#beginDate').datetimepicker('setEndDate', date);
            });
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.orgCd = '';
                $api.post('order/selectAssetInfo', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].crt_tm = vm.list[i].crt_tm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
            //取消订单条件
            vm.cancelordObj = {
                ordrCd: '',
                stcd: '',
                orgcd: '',
                rslt: 1,
                orgcdm: '',
                id: vm.id,
                rsltInf: ''
            };
            //交易信息条件
            vm.transObj = {
                ordrCd: '',
                stcd: '',
                jyType: ''
            };

//-------------------------------------------------------------------------------分割线-----------------------------------------------------//
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.sts = obj.sts;
                vm.stcd = obj.st_cd;//资产编号
                vm.orgCd = obj.org_cd;//机构编号
                vm.ordrCd = obj.ordr_cd;//订单编号
                vm.orgcdm = obj.org_cd_m;//受让方机构编号
                vm.crt_p_id = obj.crt_p_id;//受让方 1-个人 2-企业
                vm.id_flag = obj.id_flag;//出让方 1-个人 2-企业
                vm.jyType = obj.type;
            };
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    sts: '',
                    st_nm: '',
                    tp: '',
                    trns_ty: '',
                    beginDate: '',
                    endDate: '',
                    pageNum: 1,
                    pageSize: 10
                };
            };
            //查询
            vm.submit = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //关闭层
            vm.closePop = function () {
                vm.showCancelOrdPop = false;
                vm.showPersonView = false;
                vm.showOrgView = false;
                vm.showAssetView = false;
                vm.showTransView = false;
            };
            //关闭提示层
            vm.closeAlert = function () {
                vm.showAlertPop = false;
            };
            //取消按钮-弹出确认框
            vm.toAlertPop = function () {
                if (vm.cancelordObj.rsltInf == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '取消原因不能为空';
                    $util.inputFocus('rsltInf');
                    return false;
                }
                vm.showAlertPop = true;
            };
            //确认取消
            vm.toCancelOrd = function () {
                vm.cancelordObj.orgcd = vm.orgCd;
                vm.cancelordObj.stcd = vm.stcd;
                vm.cancelordObj.ordrCd = vm.ordrCd;
                vm.cancelordObj.orgcdm = vm.orgcdm;
                $api.post('order/cancelord', {cancelordObj: angular.toJson(vm.cancelordObj)}, function (result) {
                    if (result.errorMsg) {
                        vm.showAlertPop = false;
                        vm.showCancelOrdPop = false;
                        $layer.tip(result.errorMsg, 1000);
                        $timeout(function () {
                            vm.getPagedDataAsync();
                        }, 1000);
                    } else {
                        vm.showErrorMessage = false;
                        vm.erroeMessage = '';
                        vm.showAlertPop = false;
                        vm.showCancelOrdPop = false;
                        vm.cancelordObj.rsltInf = '';
                        $layer.tip('取消成功', 1000);
                        $timeout(function () {
                            vm.getPagedDataAsync();
                        }, 1000);
                    }
                });
            };
            //资产查看
            vm.assetView = function () {
                if (vm.orgCd) {
                    $api.post('asset/getAsset', {st_cd: vm.stcd, ty: 1}, function (result) {
                        vm.titleView = '资产信息';
                        vm.assetData = result.data;
                        vm.showAssetView = true;
                    })
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
            /**
             * 查看
             * @param identity    出让方&&受让方
             */
            vm.view = function (identity) {
                if (vm.orgCd) {
                    //判断身份
                    if (identity == 'org_cd_m') {
                        $api.post('org/checkOrgInfo', {orgCd: vm.orgcdm}, function (result) {
                            if (vm.crt_p_id == '2') {
                                vm.showPersonView = true;
                                vm.titleView = '个人信息查看';
                                vm.perInfo = result.data.userGrp;
                            } else {
                                vm.titleView = '企业信息查看';
                                vm.orgInfo = result.data.userGrp;
                                vm.orgInfo.staus == 0 ? vm.orgInfo.staus = '是' : vm.orgInfo.staus = '否';
                                vm.showOrgView = true;
                            }
                        });
                    } else {
                        $api.post('org/checkOrgInfo', {orgCd: vm.orgCd}, function (result) {
                            if (vm.id_flag == '2') {
                                vm.showPersonView = true;
                                vm.titleView = '个人信息查看';
                                vm.perInfo = result.data.userGrp;
                            } else {
                                vm.titleView = '企业信息查看';
                                vm.orgInfo = result.data.userGrp;
                                vm.orgInfo.staus == 0 ? vm.orgInfo.staus = '是' : vm.orgInfo.staus = '否';
                                vm.showOrgView = true;
                            }
                        });
                    }
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
//-----------------------------------------------------------------------------------------弹出层--------------------------------------------------------------------//
            //取消订单层
            vm.cancelOrd = function () {
                if (vm.orgCd) {
                    if (vm.sts == '1') {
                        vm.showCancelOrdPop = true;
                        vm.titleView = '取消订单'
                    } else {
                        return $layer.tip('只有未签署状态才可以操作');
                    }
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
            vm.viewTransInfo = function () {
                if (vm.orgCd) {
                    vm.transObj.ordrCd = vm.ordrCd;
                    vm.transObj.stcd = vm.stcd;
                    vm.transObj.jyType = vm.jyType;
                    $api.post('order/showOrderAsset', {transObj: angular.toJson(vm.transObj)}, function (result) {
                        vm.titleView = '交易信息查看';
                        vm.transData = result.data;
                        vm.showTransView = true;
                    });
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            }
        }])
}());