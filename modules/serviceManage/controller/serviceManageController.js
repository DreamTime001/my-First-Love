(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('serviceManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$layer', '$cookies', '$defaultConfig', function ($api, $timeout, $upload, $http, $state, $layer, $cookies, $defaultConfig) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showAssets = false;//资产信息查看弹窗
            vm.showPerAdvisory = false;//个人咨询机构信息查看弹窗
            vm.showComAdvisory = false;//企业咨询机构信息查看弹窗
            vm.showTrack = false;//跟踪记录清单查看弹窗
            vm.showAudit = false;//审核
            vm.showUpload = false;//资料上传弹窗
            vm.showComplete = false;//完成
            //查询条件
            vm.query = {
                prvnc: '',
                city: '',
                serviceType: '',
                serviceStatus: '',
                orgNameOrStnm: '',
                pageNum: 1,
                pageSize: 10
            };
            //服务类型
            vm.serviceTypeList = [
                {
                    name: '中间基金服务',
                    type: 1
                },
                {
                    name: '申请仲裁服务',
                    type: 5
                },
                {
                    name: '资产拆包打包服务',
                    type: 4
                }
            ];
            //服务状态
            vm.serviceStatusList = [
                {
                    name: '服务完成',
                    type: 0
                },
                {
                    name: '服务申请中',
                    type: 1
                },
                {
                    name: '服务中',
                    type: 2
                },
                {
                    name: '服务拒绝',
                    type: 9
                }
            ];
            //审核填写信息
            vm.auditEdit = {
                dateTime: '',
                record: '',
                result: '0'
            };
            //完成填写信息
            vm.completeEdit = {
                dateTime: '',
                content: ''
            };
            //资料上传
            vm.uploadEdit = {
                dateTime: '',
                content: '',
                rcdFiles: '',
                contenText: '',
                type: '',
                picNm: '',
                base_String: ''
            };
            vm.completeEdit.dateTime = new Date().format('yyyy-MM-dd');
            //省
            vm.getPrvnc = function () {
                $api.get('org/getPrvnc', function (result) {
                    vm.prvnc = result.data.list;
                    vm.prvncEdit = result.data.list;
                });
            };
            //市
            vm.getSelect = function (selected) {
                if (selected) {
                    $api.post('org/getCity', {province: selected}, function (result) {
                        vm.provinceList = result.data.list;
                    });
                }
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.org_cd = '';
                vm.query.id = $cookies.get('id');
                $api.post('service/selectServiceMangerInfo_1', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].createTime = vm.list[i].createTime.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
//------------------------------------------------------------------------------分割线----------------------------------------------------------//
            //查询
            vm.submit = function () {
                if (vm.query.serviceType) {
                    vm.query.pageNum = 1;
                    vm.getPagedDataAsync();
                } else {
                    return $layer.tip('请选择服务类型');
                }
            };
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    prvnc: '',
                    city: '',
                    serviceType: '',
                    serviceStatus: '',
                    orgNameOrStnm: '',
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
                //资产信息查看传参数
                vm.st_cd = obj.st_cd;//获取st_cd
                vm.serviceType = obj.serviceType;//获取serviceType
                //咨询机构信息查看传参数
                vm.org_cd = obj.org_cd;//获取orgCd
                vm.id_flag = obj.id_flag;//获取个人/企业身份
                //跟踪记录清单传参数
                vm.sid = obj.sid;//获取sid
                //跟踪记录清单展示信息
                vm.sts_nm = obj.sts_nm;//获取sts_nm
                vm.saleName = obj.saleName;//获取saleName
                vm.orgName = obj.orgName;//获取orgName
                //审核展示信息
                vm.sts_nm = obj.sts_nm;//获取sts_nm
                vm.orgName = obj.orgName;//获取orgName
                vm.ast_org_cd = obj.ast_org_cd;//获取ast_org_cd
                vm.tp = obj.tp;//获取tp
                //完成提交传参数
                vm.rslt = obj.rslt;//获取rslt
                vm.zc_result = obj.zc_result;//获取zc_result
                vm.counts = obj.counts;//获取counts
                vm.stsCode = obj.stsCode;//获取stsCode
                console.log(vm.stsCode);
                //下载报告
                vm.fl_name = obj.fl_name;//获取fl_name
                //资料上传
                vm.projectName = obj.sts_nm;//获取sts_nm
                vm.saleName = obj.saleName;//获取saleName
            };
            //资产信息查看
            vm.showAssetsList = function () {
                if (vm.org_cd) {
                    $api.post('asset/getAsset_1', {st_cd: vm.st_cd, serviceType: vm.serviceType}, function (result) {
                        vm.memberTitle = '资产信息详情页';
                        vm.assetsInfo = result.data;
                        vm.assetsInfo.hos_dt = vm.assetsInfo.hos_dt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                        vm.showAssets = true;
                    })
                } else {
                    return $layer.tip('请先选中一行再审核');
                }
            };
            //咨询机构信息查看弹窗
            vm.showAdvisoryList = function () {
                if (vm.org_cd) {
                    if (vm.id_flag == 2) {
                        $api.post('org/checkOrgInfo_1', {orgCd: vm.org_cd}, function (result) {
                            vm.memberTitle = '咨询机构信息查看';
                            vm.perAdvisoryInfo = result.data.userGrp;
                            vm.showPerAdvisory = true;
                        })
                    }
                    if (vm.id_flag == 1) {
                        $api.post('org/checkOrgInfo_1', {orgCd: vm.org_cd}, function (result) {
                            vm.memberTitle = '咨询机构信息查看';
                            vm.comAdvisoryInfo = result.data.userGrp;
                            vm.comAdvisoryInfo.sts == 0 ? vm.comAdvisoryInfo.show = '是' : vm.comAdvisoryInfo.show = '否';
                            vm.showComAdvisory = true;
                        })
                    }
                } else {
                    return $layer.tip('请先选中一行再查看');
                }
            };
            //跟踪记录清单
            vm.showTrackList = function () {
                if (vm.org_cd) {
                    $api.post('service/selectBySidOrgService_1', {sid: vm.sid}, function (result) {
                        vm.memberTitle = '跟踪记录清单';
                        vm.showTrack = true;
                        vm.trackInfoList = result.data;
                        if (vm.trackInfoList) {
                            for (var i = 0; i < vm.trackInfoList.length; i++) {
                                vm.trackInfoList[i].dt = vm.trackInfoList[i].dt.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                            }
                        }
                    })
                } else {
                    $layer.tip('请先选中一行再查看跟踪记录清单');
                }
            };
            //审核
            vm.showAuditList = function () {
                if (vm.org_cd) {
                    if(vm.stsCode==1){
                        vm.showAudit = true;
                        vm.memberTitle = '跟踪记录审核';
                        $timeout(function () {
                            initDate('#dateTime', 'yyyy-mm-dd', 2, function (date) {
                            }, new Date());
                        }, 500);

                    }else {
                        $layer.tip('只有服务申请中状态的数据可点击审核按钮');
                    }

                } else {
                    $layer.tip('请先选中一行再审核');
                }
            };
            //审核编辑提交
            vm.submitAudit = function () {
                vm.auditEdit.sid = vm.sid;
                vm.auditEdit.st_cd = vm.st_cd;
                vm.auditEdit.ast_org_cd = vm.ast_org_cd;
                vm.auditEdit.tp = vm.tp;
                vm.auditEdit.id = $cookies.get('id');
                $api.post('service/addOrgServiceRecord_1', {auditEditObj: angular.toJson(vm.auditEdit)}, function (result) {
                    vm.auditEdit.dateTime = new Date().format('yyyy-MM-dd');
                    vm.showAudit = false;
                    vm.auditEdit.result = '0';
                    vm.auditEdit.content = '';
                    $layer.tip('审核记录提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                });
            };
            //完成
            vm.showCompleteList = function () {
                if (vm.org_cd) {
                    if (vm.stsCode == 0) {
                        return $layer.tip('服务已经完成');
                    }
                    if (vm.stsCode == 9) {
                        return $layer.tip('服务已被拒绝');
                    }
                    if (vm.counts == '0') {
                        return $layer.tip('请先记录上传');
                    }
                    vm.showComplete = true;
                    vm.memberTitle = '跟踪记录详情';
                    $timeout(function () {
                        initDate('#dateTime', 'yyyy-mm-dd', 2, function (date) {
                        }, new Date());
                    }, 500);
                }
                else {
                    return $layer.tip('请先选中一行再完成');
                }
            };
            //完成编辑提交
            vm.submitComplete = function () {
                vm.completeEdit.sid = vm.sid;
                vm.completeEdit.tp = vm.tp;
                vm.completeEdit.st_cd = vm.st_cd;
                vm.completeEdit.rslt = vm.rslt;
                vm.completeEdit.zc_result = vm.zc_result;
                vm.completeEdit.id = $cookies.get('id');
                $api.post('service/saveOrgServiceRecord_1', {completeEditObj: angular.toJson(vm.completeEdit)}, function (result) {
                    vm.showComplete = false;
                    vm.completeEdit.content = '';
                    $layer.tip('完成记录提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000)
                });
            };
            //下载报告
            vm.showDownloadList = function () {
                if (vm.org_cd) {
                    if (vm.fl_name == '--') {
                        return $layer.tip('请等待报告上传');
                    }
                    $layer.loading();
                    $http.post($defaultConfig.app_uri + 'service/downloadAttachFile_1', {st_cd: vm.st_cd}, {responseType: 'arraybuffer'}).then(function (response) {
                        var blob = new Blob([response.data], {type: 'application/zip'});
                        var fileName = vm.fl_name;
                        saveAs(blob, decodeURI(fileName));
                        $layer.close();
                    })
                } else {
                    return $layer.tip('请先选中一行再审核');
                }
            };
            //记录/上传
            vm.showUploadList = function () {
                if (vm.org_cd) {
                    if (vm.stsCode == 1) {
                        return $layer.tip('该记录未通过审核');
                    }
                    if (vm.stsCode == 9) {
                        return $layer.tip('服务拒绝，不能记录上传');
                    }
                    if (vm.stsCode == 0) {
                        return $layer.tip('服务已完成不能记录上传');
                    }
                    vm.showUpload = true;
                    vm.memberTitle = '资料上传';
                    $timeout(function () {
                        initDate('#dateTime', 'yyyy-mm-dd', 2, function (date) {
                        }, new Date());
                    }, 500);
                } else {
                    return $layer.tip('请先选中一行再资料上传');
                }
            };
            //记录/上传提交
            vm.submitUpload = function () {
                $layer.loading();
                vm.uploadEditObj.sid = vm.sid;
                vm.uploadEditObj.st_cd = vm.st_cd;
                vm.uploadEditObj.ast_org_cd = vm.ast_org_cd;
                vm.uploadEditObj.id = $cookies.get('id');
                $upload.upload({
                    url: $defaultConfig.app_uri + 'service/addByOrgServiceRecord_1', //上传的url
                    data: {uploadEditObj: angular.toJson(vm.uploadEditObj)},
                    file: vm.file
                }).progress(function (evt) {//上传进度
                }).success(function (data, status, headers, config) {
                    if (data.code == '200') {
                        vm.uploadEditObj.dateTime = new Date().format('yyyy-MM-dd');
                        vm.showUpload = false;
                        vm.uploadEditObj.dateTime = '';
                        vm.uploadEditObj.content = '';
                        vm.uploadEditObj.rcdFiles = '';
                        vm.uploadEditObj.contenText = '';
                        vm.inputText = '';
                        $layer.tip('记录/上传提交成功', 1000);
                        $timeout(function () {
                            vm.getPagedDataAsync();
                        }, 1000)
                    }
                }).error(function (data, status, headers, config) {
                    $layer.tip('服务器异常,请重新尝试');
                });
            };
            /**
             *绑定DOM元素上传文件显示文件名
             * @param _this         //DOM节点
             **/
            vm.uploadBindDom = function (_this) {
                var filePath = $(_this).val();
                if (filePath) {
                    var arr = filePath.split('\\');
                    var fileName = arr[arr.length - 1];
                    $(_this).prev().html(fileName);
                } else {
                    $(_this).prev().html('点击这里上传文件');
                }
            };
            //关闭层
            vm.closePop = function () {
                vm.showAssets = false;//资产信息查看弹窗
                vm.showPerAdvisory = false;//个人咨询机构信息查看弹窗
                vm.showComAdvisory = false;//企业咨询机构信息查看弹窗
                vm.showTrack = false;//跟踪记录清单查看弹窗
                vm.showAudit = false;//审核
                vm.showUpload = false;//资料上传弹窗
                vm.showComplete = false;//完成
            };
            vm.inputText = "点击这里上传文件";//input框默认显示文字
            vm.file = '';
            //获取文件
            vm.onFileSelect = function ($files) {    //$files:是已选文件的名称、大小和类型的数组
                vm.file = $files[0];
                vm.inputText = vm.file.name;
            };
        }])
}());