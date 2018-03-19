(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('transferOrderConfController', ['$api', '$timeout', '$upload', '$http', '$state', '$cookies', '$layer', '$scope', '$defaultConfig', function ($api, $timeout, $upload, $http, $state, $cookies, $layer, $scope, $defaultConfig) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showAuditPop = false;//审核弹窗
            vm.showAlert = false;//审核确认提示弹窗
            vm.showAssetView = false;//资产信息查看弹窗
            vm.id = $cookies.get('id');//获取Id
            vm.query = {
                astName: '',
                crt_day_from: '',
                crt_day_to: '',
                sts: '',
                tp: '',
                pageNum: 1,
                pageSize: 10
            };
            vm.transObj = {
                rsltInf: '',
                rslt: '0',
                picNm: '',
                type: '',
                base_String: ''
            };
            vm.queryState = function () {
                //请选择状态
                $api.get('trans/initStsList', function (result) {
                    vm.stateList = result.data;
                });
                //获取指令类型
                $api.get('trans/initTpList', function (result) {
                    vm.instructList = result.data;
                });
            };
            //日期初始化
            initDate('#crt_day_from', 'yyyy-mm-dd', 2, function (date) {
                $('#crt_day_to').datetimepicker('setStartDate', date);
            });
            initDate('#crt_day_to', 'yyyy-mm-dd', 2, function (date) {
                $('#crt_day_from').datetimepicker('setEndDate', date);
            });
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    astName: '',
                    crt_day_from: '',
                    crt_day_to: '',
                    sts: '',
                    tp: '',
                    pageNum: 1,
                    pageSize: 10
                };
            };
//-----------------------------------------------------------------------------分割线---------------------------------------------------------------//
            // 图片上传
            $scope.addIcon = true;//添加按钮状态
            $scope.reader = new FileReader();   //创建一个FileReader接口
            $scope.thumb = [];//存放base64图片
            //选择图片
            $scope.img_upload = function (files, maxNum) {       //单次提交图片的函数
                if (files[0]) {
                    vm.transObj.type = files[0].type;
                    vm.transObj.picNm = files[0].name;
                    $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
                    $scope.reader.onload = function (ev) {
                        $scope.$apply(function () {
                            $scope.thumb.push(ev.target.result);
                            vm.transObj.base_String = $scope.thumb[0];
                            $scope.thumb.length > 0 ? $scope.buttonDis = false : $scope.buttonDis = true;
                            $scope.thumb.length >= maxNum ? $scope.addIcon = false : $scope.addIcon = true;
                        });
                    };
                }
            };
            //删除
            $scope.img_del = function (key, maxNum) {
                vm.iconDelete = 'imgDele';
                vm.showAlert = true;
                $scope.delete = function () {
                    $scope.thumb.splice(key, 1);
                    $scope.thumb.length > 0 ? $scope.buttonDis = false : $scope.buttonDis = true;
                    $scope.thumb.length >= maxNum ? $scope.addIcon = false : $scope.addIcon = true;
                    vm.showAlert = false;
                };
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.org_locaked_flag = null;
                vm.query.id = $cookies.get('id');
                $api.post('trans/getTrdInstList', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        if (vm.list[i].locaked_day) {
                            vm.list[i].locaked_day = vm.list[i].locaked_day.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                        }
                        vm.list[i].crt_day = vm.list[i].crt_day.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.org_locaked_flag = obj.org_locaked_flag;
                vm.org_trd_ins_id = obj.org_trd_ins_id;
                vm.locaked_user = obj.locaked_user;
                vm.tyCode = obj.tyCode;
                vm.st_cd = obj.st_cd;
                vm.ty = obj.ty;
                vm.st_lgc_tp = obj.st_lgc_tp;
                vm.loginName = obj.loginName;
                vm.sts = obj.sts;
            };
            //查询
            vm.submit = function () {
                vm.getPagedDataAsync();
            };
            //锁定
            vm.lock = function () {
                if (vm.org_locaked_flag == null) {
                    return $layer.tip('请选中一行再做锁定操作');
                } else {
                    if (vm.org_locaked_flag == 1) {
                        return $layer.tip('这条数据已经锁定了，请选择其他指令进行确认。');
                    } else {
                        $api.post('trans/locked', {org_trd_ins_id: vm.org_trd_ins_id, id: vm.id}, function (result) {
                            $layer.tip('锁定成功', 1000);
                            $timeout(function () {
                                vm.getPagedDataAsync();
                            }, 1000);
                        });
                    }
                }
            };
            //审核
            vm.audit = function () {
                if (vm.org_locaked_flag == null) {
                    return $layer.tip('请选中一行再审核');
                } else {
                    if (vm.org_locaked_flag != '1') {
                        return $layer.tip('请先锁定再审核');
                    } else {
                        if (vm.sts != '1') {
                            $layer.tip('该笔转账指令已经确认完成，请选择其他指令进行确认。');
                        } else {
                            if (vm.tyCode == 1 || vm.tyCode == 6) {
                                $api.post('trans/getImagePath', {org_trd_ins_id: vm.org_trd_ins_id}, function (result) {
                                    vm.urlPath = result.data.urlPath;
                                    vm.urlPath = $defaultConfig.app_uri + vm.urlPath;
                                })
                            }
                            vm.showAuditPop = true;
                            vm.titleView = '确认';
                        }
                    }
                }
            };
            vm.toAudit = function () {
                vm.transObj.id = $cookies.get('id');
                vm.transObj.org_trd_ins_id = vm.org_trd_ins_id;
                $api.post('trans/sbmt', {transObj: angular.toJson(vm.transObj)}, function (result) {
                    vm.showAuditPop = false;
                    vm.transObj.rslt = '0';
                    vm.transObj.rsltInf = '';
                    $scope.thumb = [];
                    $scope.addIcon = true;
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                });
            };
            /* 资产信息查看弹窗*/
            vm.assetView = function () {
                if (vm.org_locaked_flag == null) {
                    return $layer.tip('请选中一行再进行操作');
                }
                $api.post('asset/getAsset', {st_cd: vm.st_cd, ty: vm.st_lgc_tp}, function (result) {
                    vm.orgInfo = result.data;
                    vm.showAssetView = true;
                    vm.titleView = '资产信息查看';
                    vm.orgInfo.hos_dt = vm.orgInfo.hos_dt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                })
            };
            //关闭层
            vm.closePop = function () {
                vm.showAuditPop = false;
                vm.showAssetView = false;//资产信息查看弹窗
            };
            //关闭层
            vm.closePopPic = function () {
                vm.showAlert = false;//审核确认提示弹窗
            };
        }])
}());