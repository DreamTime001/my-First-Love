(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('membersListController', ['$api', '$timeout', '$upload', '$http', '$state', '$defaultConfig', '$layer', '$cookies', '$anchorScroll', '$location', '$scope', '$util', function ($api, $timeout, $upload, $http, $state, $defaultConfig, $layer, $cookies, $anchorScroll, $location, $scope, $util) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            //正则判断
            var validator = {
                email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
            };
            vm.orgCd = '';//提交的ID
            vm.checkedAll = false;//全选按钮默认状态
            vm.checkedNumber = null;//已选中的个数
            vm.totalNumber = null;//可选的个数
            vm.showPersonView = false;//个人信息查看弹出层
            vm.showOrgView = false;//企业信息查看弹出层
            vm.showPersonEdit = false;//个人信息查看弹出层
            vm.showOrgEdit = false;//企业信息查看弹出层
            vm.PersonaddBlank = false;//个人加入黑名单弹出层
            vm.companyaddBlank = false;//企业加入黑名单弹出层
            vm.showBlank = false;//加入黑名单弹出层
            vm.memberTitle = "";
            vm.distanceTime = null;
            vm.query = {
                prvnc: '',
                city: '',
                creatTime: null,
                orgName: '',
                type: null,
                pageNum: 1,
                pageSize: 10
            };
            //加入黑名单弹窗
            vm.addblackObj = {
                id: vm.id,
                orgCd: '',
                endDate: '',
                startDate: '',
                rvwInf: ''
            };
            //省
            vm.getPrvnc = function () {
                $api.get('org/getPrvnc', function (result) {
                    vm.prvnc = result.data.list;
                    vm.prvncEdit = result.data.list;
                });
            };

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
            //加入黑名单提交信息
            vm.blackInfObj = {
                startDate: '',
                endDate: ''
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.orgCd = '';
                $api.post('org/selectOrgInfo', {query: angular.toJson(vm.query)}, function (result) {
                    vm.query.type == 0 ? vm.currentType = 0 : vm.currentType = 1;
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].crt_tm = vm.list[i].crt_tm.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                        vm.list[i].bgnDt == 0 ? vm.list[i].bgnDt = '个人' : vm.list[i].bgnDt = '企业';
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
                vm.orgCd = obj.org_cd;
                vm.cmp_nm = obj.cmp_nm;//名称
                vm.ct = obj.ct;//所在城市
                vm.lscn_card = obj.lscn_card;//身份证号&&组织机构代码证
            };
            //复选框单选
            vm.singleChk = function (obj) {
                if (obj.checked) {
                    obj.checked = false;
                    vm.checkedNumber--;
                } else {
                    obj.checked = true;
                    vm.checkedNumber++;
                }
                vm.checkedNumber == vm.totalNumber ? vm.checkedAll = true : vm.checkedAll = false
            };
            //复选框全选
            vm.allChk = function () {
                vm.checkedAll ? vm.checkedAll = false : vm.checkedAll = true;
                if (vm.checkedAll) {
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = true;
                    }
                } else {
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;
                    }
                }
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
            /**
             * 统一按钮
             * @param doing    事件(包括查看、编辑、加入黑名单等)
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
                                    vm.memberTitle = '企业信息查看';
                                    vm.orgInfo = result.data.userGrp;
                                    vm.orgInfo.staus == 0 ? vm.orgInfo.staus = '是' : vm.orgInfo.staus = '否';
                                    vm.showOrgView = true;
                                });
                            }
                            break;
                        case 'edit':
                            if (vm.currentType == 0) {
                                $api.post('org/selectPerCd', {orgCd: vm.orgCd}, function (result) {
                                    vm.memberTitle = '个人信息修改';
                                    vm.perInfo = result.data;
                                    vm.showPersonEdit = true;
                                });
                            }
                            if (vm.currentType == 1) {
                                $api.post('org/checkOrgInfo', {orgCd: vm.orgCd}, function (result) {
                                    vm.memberTitle = '企业信息查看';
                                    vm.orgInfo = result.data.userGrp;
                                    vm.showOrgEdit = true;
                                    vm.orgInfo.liDate = vm.orgInfo.liDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                                    //成立日期初始化
                                    $timeout(function () {
                                        initDate('#liDate', 'yyyy-mm-dd', 2, function (date) {
                                        });
                                    }, 1000);
                                    if (vm.orgInfo.provinceId) {
                                        $api.post('org/getCity', {province: vm.orgInfo.provinceId}, function (result) {
                                            vm.provinceEdit = result.data.list;
                                        });
                                    }
                                });
                            }
                            break;
                        case'addBlack':
                            vm.currentType == 0 ? vm.memberTitle = '个人加入黑名单' : vm.memberTitle = '企业加入黑名单';
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
                            vm.showBlank = true;
                    }
                } else {
                    return $layer.tip('请选择至少选择一个会员进行操作');
                }
            };
            //关闭层
            vm.closePop = function () {
                vm.showPersonView = false;
                vm.showOrgView = false;
                vm.showPersonEdit = false;
                vm.showOrgEdit = false;
                vm.showErrorMessage = false;
                vm.PersonaddBlank = false;//个人加入黑名单弹出层
                vm.companyaddBlank = false;//企业加入黑名单弹出层
                vm.showBlank = false;
                vm.erroeMessage = '';
                vm.distanceTime = null;
                vm.blackInfObj.startDate = '';
                vm.blackInfObj.endDate = '';
            };
            //算字符
            vm.getBate = function (str) {
                var len = 0;
                for (var i = 0; i < str.length; i++) {
                    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                        len += 2;
                    } else {
                        len++;
                    }
                }
                return len;
            };
            //个人修改提交
            vm.updatePerInfo = function () {
                angular.element('.form-control').removeClass('has-error');
                vm.showErrorMessage = false;
                //昵称格式
                if (vm.perInfo.nickNm) {
                    if (vm.getBate(vm.perInfo.nickNm) < 6) {
                        vm.showErrorMessage = true;
                        vm.erroeMessage = '昵称不能少于6个字符';
                        $util.inputFocus('nickNm');
                        return false
                    }
                }
                //姓名不能为空
                if (vm.perInfo.realNm == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '真实姓名不能为空';
                    $util.inputFocus('realNm');
                    return false
                }
                //姓名格式
                if (vm.getBate(vm.perInfo.realNm) < 6 || vm.getBate(vm.perInfo.realNm) > 20) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '真实姓名为6-20个字符之间';
                    $util.inputFocus('realNm');
                    return false
                }
                //身份证不能为空
                if (vm.perInfo.idCard == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '身份证号不能为空';
                    $util.inputFocus('idCard');
                    return false
                }
                //身份证格式
                if (!convertCardID(vm.perInfo.idCard)) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请输入正确的身份证号';
                    $util.inputFocus('idCard');
                    return false
                }
                //判断邮箱
                if (vm.perInfo.email == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请输入邮箱';
                    $util.inputFocus('email');
                    return false
                }
                //邮箱格式
                if (!validator.email.test(vm.perInfo.email)) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请输入正确的邮箱';
                    $util.inputFocus('email');
                    return false
                }
                vm.perInfo.orgCd = vm.orgCd;
                vm.showErrorMessage = false;
                vm.erroeMessage = '';
                $api.post('org/updatePerInfo', {perInfo: angular.toJson(vm.perInfo)}, function (result) {
                    vm.showPersonEdit = false;
                    $layer.tip('个人信息提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                });
            };
            //企业修改提交
            vm.updateOrgInfo = function () {
                vm.orgInfo.orgCd = vm.orgCd;
                vm.orgInfo.id = $cookies.get('id');
                $api.post('org/updateOrgInfo', {orgInfo: angular.toJson(vm.orgInfo)}, function (result) {
                    vm.showOrgEdit = false;
                    $layer.tip('企业信息提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                });
            };
            //个人加入黑名单提交
            vm.updateBlank = function () {
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
                vm.blackInfObj.id = $cookies.get('id');
                vm.blackInfObj.orgCd = vm.orgCd;
                $api.post('org/updateOrgPerBlacklistInfo', {blackInfObj: angular.toJson(vm.blackInfObj)}, function (result) {
                    vm.showBlank = false;
                    vm.distanceTime = null;
                    vm.blackInfObj.startDate = '';
                    vm.blackInfObj.endDate = '';
                    vm.blackInfObj.rvwInf = '';
                    $layer.tip('加入黑名单成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                });
            };
        }])
}());