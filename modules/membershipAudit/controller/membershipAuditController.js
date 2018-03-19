(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('membershipAuditController', ['$api', '$timeout', '$upload', '$http', '$state', '$defaultConfig', '$anchorScroll', '$location', '$layer', '$cookies', function ($api, $timeout, $upload, $http, $state, $defaultConfig, $anchorScroll, $location, $layer, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.orgCd = '';//提交的ID
            vm.userNm = '';//列表的电话号码
            vm.checkedAll = false;//全选按钮默认状态
            vm.checkedNumber = null;//已选中的个数
            vm.totalNumber = null;//可选的个数
            vm.showMember = false;//弹出层
            vm.showPersonView = false;//个人信息查看弹出层
            vm.showOrgView = false;//企业信息查看弹出层
            vm.showPersonEdit = false;//个人信息查看弹出层
            vm.showOrgEdit = false;//企业信息查看弹出层
            vm.showListPop = false;//追踪记录弹出层
            vm.memberTitle = "";
            vm.query = {
                prvnc: '',
                city: '',
                creatTime: 0,
                orgName: '',
                type: null,
                pageNum: 1,
                pageSize: 10,
                auditStatus: ''

            };
            //追踪弹出框显示信息
            vm.listObj = {
                cmp_nm: '',
                ct: ''
            };
            //省
            $api.get('org/getPrvnc', function (result) {
                vm.prvncList = result.data.list;
            });
            //会员类型
            vm.memberType = [
                {
                    name: '个人',
                    type: '0'
                },
                {
                    name: '企业',
                    type: '1'
                }
            ];
            //创建时间
            vm.createTimeArry = [
                {
                    name: '一周',
                    creatTime: '1'
                },
                {
                    name: '一个月以内',
                    creatTime: '2'
                },
                {
                    name: '三个月以内',
                    creatTime: '3'
                },
                {
                    name: '三个月以上',
                    creatTime: '4'
                }
            ];
            //审核状态
            vm.rvwRsltArry = [
                {
                    name: '通过',
                    type: '0'
                },
                {
                    name: '未通过',
                    type: '1'
                },
                {
                    name: '退回修改',
                    type: '2'
                }
            ];
            // 审核状态
            vm.auditStatusArry = [
                {
                    name: '通过',
                    auditStatus: '0'
                },
                {
                    name: '待审核',
                    auditStatus: '1'
                },
                {
                    name: '未通过',
                    auditStatus: '2'
                },
                {
                    name: '退回修改',
                    auditStatus: '3'
                }
            ];
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.orgCd = '';
                $api.post('org/selectOrgAuditInfo', {query: angular.toJson(vm.query)}, function (result) {
                    vm.query.type == 0 ? vm.currentType = 0 : vm.currentType = 1;
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].crt_tm = vm.list[i].crt_tm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
//---------------------------------------------------------------------------------------分割线-----------------------------------------------------------------------------------------//
            //查询
            vm.submit = function () {
                if (vm.query.type) {
                    vm.getPagedDataAsync();
                } else {
                    return $layer.tip('请选择会员类型')
                }
            };
            //重置
            vm.resetQuery = function () {
                // vm.list = [];
                vm.query = {
                    prvnc: '',
                    city: '',
                    creatTime: 0,
                    orgName: '',
                    type: null,
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
                vm.orgCd = obj.org_cd;//获取orgCD
                vm.sts_code = obj.sts_code;//获取审核状态
                vm.listObj.cmp_nm = obj.cmp_nm;
                vm.listObj.ct = obj.ct;
                vm.userNm = obj.userNm;
            };
            //复选框选中的值
            vm.getSelect = function (selected) {
                if (selected) {
                    $api.post('org/getCity', {province: selected}, function (result) {
                        vm.provinceList = result.data.list;
                    });
                }
            };
            /**
             * 统一按钮
             * @param doing    事件(包括查看、编辑等)
             *
             */
            vm.singleClick = function (doing) {
                if (vm.orgCd) {
                    switch (doing) {
                        case 'view':
                            if (vm.currentType == 0) {
                                $api.post('org/selectPerCd', {orgCd: vm.orgCd}, function (result) {
                                    vm.memberTitle = '个人信息查看';
                                    vm.perInfo = result.data;
                                    vm.showPersonView = true;
                                });
                            }
                            if (vm.currentType == 1) {
                                $api.post('org/checkOrgInfo', {orgCd: vm.orgCd}, function (result) {
                                    vm.orgInfo = result.data.userGrp;
                                    vm.memberTitle = '企业信息查看';
                                    vm.orgInfo.staus == 0 ? vm.orgInfo.staus = '是' : vm.orgInfo.staus = '否';
                                    vm.showOrgView = true;
                                });
                            }
                            break;
                        case 'edit':
                            if (vm.currentType == 0) {
                                if (vm.sts_code == 1) {
                                    $api.post('org/selectPerCdInfo', {orgCd: vm.orgCd}, function (result) {
                                        vm.perInfo = result.data;
                                        vm.perInfo.rvwRslt = null;
                                        vm.perInfo.rvwInf = '';
                                        vm.memberTitle = '个人信息审核';
                                        vm.showPersonEdit = true;
                                        /* 验证身份*/
                                        vm.perInfo.checkFlag == 0 ? vm.idMessage = '身份验证成功' : vm.idMessage = '身份验证失败';
                                    });
                                } else {
                                    $layer.tip('只有待审核才能进行审核');
                                }
                            }
                            if (vm.currentType == 1) {
                                if (vm.sts_code == 1) {
                                    $api.post('org/checkOrgInfos', {orgCd: vm.orgCd}, function (result) {
                                        vm.perInfo = result.data.userGrp;
                                        vm.fileName = vm.perInfo.fileName;//下载文件名
                                        vm.perInfo.rvwRslt = null;
                                        vm.perInfo.rvwInf = '';
                                        vm.memberTitle = '企业信息审核';
                                        vm.perInfo.staus == 0 ? vm.perInfo.staus = '是' : vm.perInfo.staus = '否';
                                        vm.showOrgEdit = true;
                                        /* 验证身份*/
                                        switch (vm.perInfo.flagCode) {
                                            case '1':
                                                vm.zhiNoMessage = '没有查到相关企业信息';
                                                break;
                                            case '2':
                                                vm.zhiNoMessage = '统一信用代码一致';
                                                break;
                                            case '3':
                                                vm.zhiNoMessage = '注册号一致';
                                                break;
                                            case '4':
                                                vm.zhiNoMessage = '统一信用代码或注册号不一致';
                                                break;
                                            case '5':
                                                vm.zhiNoMessage = '接口调用失败';
                                                break;
                                        }
                                        if (vm.perInfo.flagCode == '2' || vm.perInfo.flagCode == '3') {
                                            vm.yzsf = true
                                        } else {
                                            vm.yzsfsb = true;
                                        }
                                        vm.perInfo.liDate = vm.perInfo.liDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                                        if (vm.perInfo.provinceId) {
                                            $api.post('org/getCity', {province: vm.perInfo.provinceId}, function (result) {
                                                vm.provinceEdit = result.data.list;
                                            });
                                        }
                                    });
                                } else {
                                    $layer.tip('只有待审核才能进行审核');
                                }
                                break;
                            }
                            break;
                    }
                } else {
                    return $layer.tip('请选择至少选择一个会员进行操作');
                }
            };
            var header = {};
            header[$defaultConfig.header_token_code] = $cookies.get($defaultConfig.session_code);
            //下载
            vm.downLoad = function () {
                $layer.loading();
                $http.post($defaultConfig.app_uri + 'org/downloadOrgFile', {orgCd: vm.orgCd}, {responseType: 'arraybuffer',headers:header}).then(function (response) {
                    var blob = new Blob([response.data], {type: 'application/zip'});
                    var fileName = vm.fileName + '.zip';
                    saveAs(blob, decodeURI(fileName));
                    $layer.close();
                })
            };
            //关闭层
            vm.closePop = function () {
                vm.showPersonView = false;
                vm.showOrgView = false;
                vm.showPersonEdit = false;
                vm.showOrgEdit = false;
                vm.showErrorMessage = false;
                vm.showListPop = false;
                vm.erroeMessage = '';
            };
            //个人审核提交
            vm.submitPer = function () {
                angular.element('.form-control').removeClass('has-error');
                vm.showErrorMessage = false;
                if (vm.perInfo.rvwRslt == null) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请选择审核结果';
                    $util.inputFocus('rvwRslt');
                    return false
                }
                if (vm.perInfo.rvwRslt != 0 && vm.perInfo.rvwInf == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '审核意见不能为空';
                    $util.inputFocus('rvwInf');
                    return false
                }
                vm.perInfo.orgCd = vm.orgCd;
                vm.perInfo.id = $cookies.get('id');
                vm.perInfo.name = vm.perInfo.usr_cd;
                vm.perInfo.phone = vm.perInfo.usr_cd;
                vm.perInfo.type = 0;
                $api.post('org/addOrgRvw', {perInfo: angular.toJson(vm.perInfo)}, function (result) {
                    vm.showPersonEdit = false;
                    $layer.tip('个人审核提交成功',1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                });
            };
            //企业审核提交
            vm.updateOrgInfo = function () {
                angular.element('.form-control').removeClass('has-error');
                vm.showErrorMessage = false;
                if (vm.perInfo.rvwRslt == null) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请选择审核结果';
                    $util.inputFocus('rvwRslt');
                    return false
                }
                if (vm.perInfo.rvwRslt != 0 && vm.perInfo.rvwInf == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '审核意见不能为空';
                    $util.inputFocus('rvwInf');
                    return false
                }
                vm.perInfo.orgCd = vm.orgCd;
                vm.perInfo.id = $cookies.get('id');
                vm.perInfo.name = vm.perInfo.usr_cd;
                vm.perInfo.phone = vm.perInfo.usr_cd;
                vm.perInfo.type = 1;
                $api.post('org/addOrgRvw', {perInfo: angular.toJson(vm.perInfo)}, function (result) {
                    vm.showOrgEdit = false;
                    $layer.tip('企业审核提交成功',1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                });
            };
            // 追踪管理
            vm.logList = function () {
                if (vm.orgCd) {
                    $api.post('org/querybackInfo', {orgCd: vm.orgCd}, function (result) {
                        vm.titleView = '追踪记录';
                        vm.popLogList = result.data;
                        if (vm.popLogList) {
                            for (var i = 0; i < vm.popLogList.length; i++) {
                                vm.popLogList[i].trckTime = vm.popLogList[i].trckTime.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                            }
                        }
                        vm.showListPop = true;
                    })
                } else {
                    return $layer.tip('请至少选择一个会员进行操作');
                }
            }
        }])
}());