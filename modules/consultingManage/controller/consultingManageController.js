(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('consultingManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$layer', '$location', '$anchorScroll', '$cookies', '$util',function ($api, $timeout, $upload, $http, $state, $layer, $location, $anchorScroll, $cookies,$util) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.orgCd = '';//提交的ID
            vm.sid = '';//提交的sid
            vm.st_cd = '';//提交的st_cd
            vm.ty = '';//提交的ty
            vm.showListtrack = false;//跟踪记录查看弹出层
            vm.showAssets = false;//资产信息查看弹窗
            vm.showAdvice = false;//发起咨询机构查看弹窗
            vm.showPublish = false;//资产发布机构名称查看弹窗
            vm.showtrackEdit = false;//跟踪记录编辑弹窗
            vm.idflag = null;
            vm.query = {
                prvnc: '',
                city: '',
                creatTime: '',
                orgNameOrStnm: '',
                pageNum: 1,
                pageSize: 10
            };
            //跟踪记录编辑
            vm.trackEdit = {
                content: '',
                dateTime: new Date().format('yyyy-MM-dd')
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
            /*访问时间*/
            vm.creatTimeList = [
                {
                    name: '一周',
                    type: '1'
                },
                {
                    name: '一个月以内',
                    type: '2'
                },
                {
                    name: '3个月以内',
                    type: '3'
                },
                {
                    name: '3个月以上   ',
                    type: '4'
                }
            ];
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.st_cd = '';
                vm.fa = '';
                vm.orgCd = '';
                vm.sid = '';
                $api.post('service/selectServiceInfo_1', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].zxDate = vm.list[i].zxDate.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//

            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.sid = obj.sid;//获取sid
                vm.st_cd = obj.st_cd;//获取st_cd
                vm.orgCd = obj.issue;//获取st_cd
                vm.ty = obj.tp;//获取ty
                vm.fa = obj.fa;//获取fa
                vm.issue = obj.issue;//获取issue
                vm.createTime = obj.createTime;//获取个人/企业身份
                vm.orgNm = obj.orgNm;
                vm.faOrgName = obj.faOrgName;
                vm.orgName = obj.orgName;
                vm.idflag = obj.idflag;
                vm.maiName = obj.faOrgName;//获取卖方机构:
                vm.zxOrgName = obj.orgName;//获取咨询机构:
            };
            //查询
            vm.submit = function () {
                vm.getPagedDataAsync();
            };
            //重置
            vm.resetQuery = function () {
                vm.query = {
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
                if (vm.sid) {
                    $api.post('service/selectBySidOrgZhuiz_1', {sid: vm.sid}, function (result) {
                        vm.titleView = '跟踪详情页';
                        vm.trackperInfo = result.data;
                        if (vm.trackperInfo) {
                            for (var i = 0; i < vm.trackperInfo.length; i++) {
                                vm.trackperInfo[i].createTime = vm.trackperInfo[i].createTime.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                            }
                        }
                        vm.showListtrack = true;
                    })
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            };
            //资产信息查看
            vm.showAssetsList = function () {
                if (vm.st_cd) {
                    $api.post('asset/getAsset_1', {st_cd: vm.st_cd, ty: vm.ty}, function (result) {
                        vm.memberTitle = '资产信息详情页';
                        vm.assetsInfo = result.data;
                        vm.showAssets = true;
                    })
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            };
            //发起咨询机构查看
            vm.showAdviceList = function () {
                if (vm.fa) {
                    if (vm.createTime == 1) {
                        $api.post('org/checkOrgInfo_1', {orgCd: vm.fa}, function (result) {
                            vm.memberTitle = '交易咨询机构信息';
                            vm.advicesInfo = result.data.userGrp;
                            vm.advicesInfo.sts == 0 ? vm.advicesInfo.show = '是' : vm.advicesInfo.show = '否';
                            vm.showAdvice = true;
                        })
                    }
                    if (vm.createTime == 2) {
                        $api.post('org/checkOrgInfo_1', {orgCd: vm.fa}, function (result) {
                            vm.memberTitle = '交易咨询机构信息';
                            vm.publishInfo = result.data.userGrp;
                            vm.showPublish = true;
                        })
                    }
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            };
            //资产发布机构查看
            vm.showPublishList = function () {
                if (vm.orgCd) {
                    if (vm.ty == 1) {
                        $api.post('org/checkOrgInfo_1', {orgCd: vm.orgCd}, function (result) {
                            vm.memberTitle = '资产发布机构信息';
                            vm.advicesInfo = result.data.userGrp;
                            vm.showAdvice = true;
                        })
                    }
                    if (vm.ty == 2) {
                        $api.post('org/checkOrgInfo_1', {orgCd: vm.orgCd}, function (result) {
                            vm.memberTitle = '资产发布机构信息';
                            vm.publishInfo = result.data.userGrp;
                            vm.showPublish = true;
                        })
                    }
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            };
            //跟踪记录编辑
            vm.trackEditList = function () {
                if (vm.sid) {
                    vm.memberTitle = '编辑跟踪记录';
                    vm.showtrackEdit = true;
                    $timeout(function () {
                        initDate('#dateTime', 'yyyy-mm-dd', 2, function (date) {
                        }, new Date());
                    }, 500);
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            };
            //跟踪记录编辑提交
            vm.submittrack = function () {
                angular.element('.form-control').removeClass('has-error');
                vm.showErrorMessage = false;
                if (vm.trackEdit.content == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请输入跟踪记录';
                    $util.inputFocus('content');
                    return false
                }
                vm.trackEdit.sid = vm.sid;
                vm.trackEdit.id = $cookies.get('id');
                $api.post('service/addByOrgRecord_1', {trackEditObj: angular.toJson(vm.trackEdit)}, function (result) {
                    vm.showtrackEdit = false;
                    vm.trackEdit.dateTime = new Date().format('yyyy-MM-dd');
                    vm.trackEdit.content = '';
                    $layer.tip('编辑跟踪记录提交成功',1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                });
            };
            //关闭
            vm.closePop = function () {
                vm.showListtrack = false;//跟踪记录查看弹出层
                vm.showAssets = false;//资产信息查看弹窗
                vm.showAdvice = false;//发起咨询机构查看弹窗
                vm.showPublish = false;//资产发布机构名称查看弹窗
                vm.showtrackEdit = false;//跟踪记录编辑弹窗
            }
        }])
}());