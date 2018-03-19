(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('surveyServiceManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$cookies', '$location', '$anchorScroll', '$layer', '$util', function ($api, $timeout, $upload, $http, $state, $cookies, $location, $anchorScroll, $layer, $util) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);

            vm.id = $cookies.get('id');//获取Id
            vm.showAlertPop = false;//确定框
            vm.showOrdersPop = false;//确认接单框
            vm.showErrorMessage = false;//报错提示框
            //查询条件
            vm.query = {
                prvnc: '',
                city: '',
                serviceStatus: '',
                orgNameOrStnm: '',
                id: vm.id,
                pageNum: 1,
                pageSize: 10
            };
            //抢单-接单
            vm.operaSrvcObj = {
                flag: '',
                jdid: '',
                id: vm.id,
                srvc_fin_tm: '',
                per_nm: '',
                tel: ''
            };

            //尽调跳转参数
            vm.bestTuneObj = {
                id: vm.id,
                jdid: '',
                st_cd: '',
                org_cd: ''
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
            //服务状态
            vm.serverStateList = [
                {
                    serviceStatus: 0,
                    name: '尽调完成'
                },
                {
                    serviceStatus: 1,
                    name: '待接单'
                },
                {
                    serviceStatus: 2,
                    name: '抢单成功'
                },
                {
                    serviceStatus: 3,
                    name: '尽调中'
                }
            ];
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.oper_ty = '';
                $api.post('service/selectServiceApplicationInfo', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].crt_tm = vm.list[i].crt_tm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                        switch (vm.list[i].oper_ty) {
                            case '0':
                                vm.list[i].oper_text = '前台下载报告';
                                break;
                            case '1':
                                vm.list[i].oper_text = '其他机构正在服务';
                                break;
                            case '2':
                                vm.list[i].oper_text = '接单';
                                break;
                            case '4':
                                vm.list[i].oper_text = '上传尽调信息';
                                break;
                            case '5':
                                vm.list[i].oper_text = '修改尽调信息';
                                break;
                        }
                    }
                    vm.query.pages = result.data.pages;
                })
            };
//------------------------------------------------------------------------------------------- 分割线 --------------------------------------------------------------------//
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.jdid = obj.jdid;
                vm.oper_ty = obj.oper_ty;
                vm.st_nm = obj.st_nm;
                vm.st_cd = obj.st_cd;
                vm.org_cd = obj.org_cd;
            };
            //关闭层
            vm.closePop = function () {
                vm.showAlertPop = false;
                vm.showOrdersPop = false;
            };
            //查询
            vm.submit = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            // 抢单
            vm.operaSrvc = function (jdid) {
                vm.operaSrvcObj.flag = 3;
                vm.operaSrvcObj.jdid = jdid;
                $api.post('service/operaSrvc', {operaSrvcObj: angular.toJson(vm.operaSrvcObj)}, function (result) {
                    $layer.tip('抢单成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                })
            };
            //指派
            vm.assign = function (flag, jdid) {
                vm.operaSrvcObj.flag = flag;
                vm.operaSrvcObj.jdid = jdid;
                $api.post('service/operaSrvc', {operaSrvcObj: angular.toJson(vm.operaSrvcObj)}, function (result) {
                    vm.operaSrvcObj.flag == 1 ? $layer.tip('指派成功', 1000) : $layer.tip('已取消', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                })
            };
            //接单弹层
            vm.orders = function () {
                if (vm.oper_ty) {
                    if (vm.oper_ty == 2) {
                        vm.showAlertPop = true;
                        vm.titleView = '提示';
                    } else {
                        return $layer.tip('只有抢单成功才可以操作');
                    }
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
            //确认接单信息层
            vm.confirmOrders = function () {
                vm.showAlertPop = false;
                vm.showOrdersPop = true;
                vm.titleView = '接单人信息';
                var curDate = new Date();//今天
                var nextDay = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);//明天
                $timeout(function () {
                    initDate('#srvc_fin_tm', 'yyyy-mm-dd', 2, function (date) {
                    }, curDate);
                }, 10);
            };
            //确认接单按钮
            vm.toOrder = function () {
                angular.element('.form-control').removeClass('has-error');
                if (vm.operaSrvcObj.per_nm == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '负责人不能为空';
                    $util.inputFocus('per_nm');
                    return false;
                }
                if (vm.operaSrvcObj.tel == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '联系电话不能为空';
                    $util.inputFocus('tel');
                    return false;
                }
                if (vm.operaSrvcObj.srvc_fin_tm == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请选择预计完成日期';
                    $util.inputFocus('srvc_fin_tm');
                    return false;
                }
                vm.operaSrvcObj.flag = 4;
                vm.operaSrvcObj.jdid = vm.jdid;
                $api.post('service/operaSrvc', {operaSrvcObj: angular.toJson(vm.operaSrvcObj)}, function (result) {
                    vm.showOrdersPop = false;
                    $layer.tip('接单成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            /**
             * 上传或修改尽调
             * @param type    upload - 上传
             *                 edit - 修改
             */
            vm.uploadBest = function (type) {
                if (vm.oper_ty) {
                    switch (type) {
                        case 'upload':
                            if (vm.oper_ty == '4') {
                                vm.bestTuneObj.st_cd = vm.st_cd;
                                vm.bestTuneObj.org_cd = vm.org_cd;
                                vm.bestTuneObj.jdid = vm.jdid;
                                $cookies.putObject("bestTuneObj", vm.bestTuneObj);
                                $state.go('uploadBestMes');
                            } else {
                                return $layer.tip('只有接单状态才可以上传');
                            }
                            break;
                        case 'edit':
                            if (vm.oper_ty == '5') {
                                vm.bestTuneObj.st_cd = vm.st_cd;
                                vm.bestTuneObj.org_cd = vm.org_cd;
                                vm.bestTuneObj.jdid = vm.jdid;
                                $cookies.putObject("bestTuneObj", vm.bestTuneObj);
                                $state.go('uploadBestMes');
                            } else {
                                return $layer.tip('只有已上传尽调才可修改');
                            }
                            break;
                    }
                } else {
                    return $layer.tip('请选中之后进行操作');
                }
            };
        }])
}());