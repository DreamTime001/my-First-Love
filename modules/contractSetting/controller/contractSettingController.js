(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('contractSettingController', ['$api', '$timeout', '$upload', '$http', '$state', '$cookies', '$layer', '$defaultConfig', '$util', function ($api, $timeout, $upload, $http, $state, $cookies, $layer, $defaultConfig, $util) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showViewList = false;
            vm.showEdit = false;
            vm.showAlert = false;
            vm.showExamine = false;
            vm.showAdd = false;
            vm.examineInfo = {};
            //查询条件
            vm.query = {
                assestType: '',
                cntrctType: '',
                dealType: '',
                cntrctStatus: '',
                nameAndSid: '',
                pageNum: 1,
                pageSize: 10
            };
            //资产类型
            vm.assestTypeList = [
                {
                    assestType: '1',
                    name: '一般金融资产'
                },
                {
                    assestType: '9',
                    name: '要约交易'
                }
            ];
            //合同类型
            vm.cntrctTypeList = [
                {
                    cntrctType: '0',
                    name: '交易合同'
                },
                {
                    cntrctType: '1',
                    name: '平台服务合同'
                }
            ];
            //权利类型
            vm.dealTypeList = [
                {
                    dealType: '1',
                    name: '债权'
                },
                {
                    dealType: '2',
                    name: '股权'
                },
                {
                    dealType: '3',
                    name: '产权'
                }
            ];
            //合同模板状态
            vm.cntrctStatusList = [
                {
                    cntrctStatus: '1',
                    name: '待审核'
                },
                {
                    cntrctStatus: '2',
                    name: '已生效'
                },
                {
                    cntrctStatus: '3',
                    name: '已拒绝'
                }
            ];
            //新增合同模板
            vm.examinAddObj = {
                cntrctType: null,
                assestType: null,
                dealType:null,
                nm: null
            };
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.tmpltSid = '';
                $api.post('cntrct/selectCntrctInfo_1', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].createTime = vm.list[i].createTime.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/g, '$1-$2-$3 $4:$5:$6');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };
//--------------------------------------------------------------------分割线---------------------------------------------------------------------------------------------//
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.tmpltSid = obj.tmpltSid;
                vm.sts_code = obj.sts_code;
                vm.nm = obj.nm;//合同模板名称
                vm.contrctTp = obj.contrctTp;//合同类型
                vm.contrctTp_name = obj.contrctTp_name;
                vm.stTp = obj.stTp;//资产类型
                vm.stTp_name = obj.stTp_name;
                vm.trdTp = obj.trdTp;//权利类型
                vm.trdTp_name = obj.trdTp_name;
            };
            //查询
            vm.submit = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //关闭
            vm.closePop = function () {
                vm.showErrorMessage = false;
                vm.erroeMessage = '';
                vm.showViewList = false;
                vm.showEdit = false;
                vm.showAlert = false;
                vm.showExamine = false;
                vm.showAdd = false
            };
            //查看框
            vm.showViewListPop = function () {
                if (vm.tmpltSid) {
                    $api.post('cntrct/selectCntrctTmpltTrck_1', {tmpltSid: vm.tmpltSid}, function (result) {
                        vm.viewList = result.data;
                        for (var i = 0; i < vm.viewList.length; i++) {
                            vm.viewList[i].updTm = vm.viewList[i].updTm.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                        }
                        vm.showViewList = true;
                        vm.titleView = '查看详情';
                    });
                } else {
                    return $layer.tip('请选择一条数据')
                }
            };
            /**
             *获取文件
             * @param $files        //文件
             * @param type         //上传的类型
             * @param doing        //新增 || 编辑
             **/
            vm.onFileSelect = function ($files, type, doing) {    //$files:是已选文件的名称、大小和类型的数组
                switch (type) {
                    case 'dos':
                        vm.fileDos = $files[0];
                        if (doing == 'add') {
                            vm.inputTextDosAdd = vm.fileDos.name;
                        } else {
                            vm.inputTextDosEdit = vm.fileDos.name;
                        }
                        break;
                    case 'pdf':
                        vm.filePdf = $files[0];
                        if (doing == 'add') {
                            vm.inputTextPdfAdd = vm.filePdf.name;
                        } else {
                            vm.inputTextPdfEdit = vm.filePdf.name;
                        }
                        break;
                }
            };
            //编辑框
            vm.showEditPop = function () {
                if (vm.tmpltSid) {
                    if (vm.sts_code == 1) {
                        vm.showEdit = true;
                        vm.titleView = '编辑';
                        vm.inputTextDosEdit = vm.nm + '.docx';//input框默认显示文字
                        vm.inputTextPdfEdit = vm.nm + '.pdf';//input框默认显示文字
                        vm.fileDos = '';
                        vm.filePdf = '';
                    } else {
                        return $layer.tip('只有待审核才能编辑')
                    }
                } else {
                    return $layer.tip('请选择一条数据')
                }
            };
            //编辑确认按钮
            vm.toEdit = function () {
                vm.uploadEditObj = {};
                vm.uploadEditObj.contrctTp = vm.contrctTp;
                vm.uploadEditObj.stTp = vm.stTp;
                vm.uploadEditObj.trdTp = vm.trdTp;
                vm.uploadEditObj.tmpltSid = vm.tmpltSid;
                vm.uploadEditObj.cntrctName = vm.nm;
                vm.uploadEditObj.id = $cookies.get('id');
                $layer.loading();
                $upload.upload({
                    url: $defaultConfig.app_uri + 'cntrct/updateCntrct_1', //上传的url
                    data: {trackEditObj: angular.toJson(vm.uploadEditObj), fileDos: vm.fileDos, filePdf: vm.filePdf}
                }).progress(function (evt) {//上传进度
                }).success(function (data, status, headers, config) {
                    if (data.code == '200') {
                        vm.showEdit = false;
                        vm.uploadEditObj = {};
                        vm.inputTextDosEdit = vm.nm + '.docx';
                        vm.inputTextPdfEdit = vm.nm + '.pdf';
                        vm.fileDos = '';
                        vm.filePdf = '';
                        $layer.tip('上传成功');
                        $timeout(function () {
                            vm.getPagedDataAsync();
                        }, 1000)
                    }
                }).error(function (data, status, headers, config) {
                    $layer.tip('服务器异常,请重新尝试');
                });
            };
            //删除框
            vm.showAlertPop = function () {
                if (vm.tmpltSid) {
                    vm.showAlert = true;
                } else {
                    return $layer.tip('请选择一条数据')
                }
            };
            //删除确认按钮
            vm.toDelete = function () {
                $api.post('cntrct/deleteCntrct_1', {tmpltSid: vm.tmpltSid}, function (result) {
                    vm.showAlert = false;
                    $layer.tip('删除成功');
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 500)
                });
            };
            //审核框
            vm.showExaminePop = function () {
                if (vm.tmpltSid) {
                    if (vm.sts_code == 1) {
                        vm.showExamine = true;
                        vm.titleView = '审核';
                        $timeout(function () {
                            initDate('#crtTm', 'yyyy-mm-dd', 2);
                        }, 500);
                    } else {
                        return $layer.tip('只有待审核才能审核')
                    }
                } else {
                    return $layer.tip('请选择一条数据')
                }
            };
            //审核确认按钮
            vm.toExamine = function () {
                vm.examineInfo.id = $cookies.get('id');
                vm.examineInfo.tmpltSid = vm.tmpltSid;
                $api.post('cntrct/addCntrctTmpltRvw_1', {trackEditObj: angular.toJson(vm.examineInfo)}, function (result) {
                    vm.showExamine = false;
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 500)
                });
            };
            //新增合同模板框
            vm.showAddPop = function () {
                vm.showAdd = true;
                vm.titleView = '新增';
                vm.inputTextDosAdd = '点击上传文件';
                vm.inputTextPdfAdd = '点击上传文件';
                vm.fileDos = '';
                vm.filePdf = '';
            };
            //新增确认按钮
            vm.toAdd = function () {
                angular.element('.form-control').removeClass('has-error');
                if (vm.examinAddObj.cntrctType == null) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请选择合同类型';
                    return $util.inputFocus('cntrctType');
                }
                if (vm.examinAddObj.assestType == null) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请选择资产类型';
                    return $util.inputFocus('assestType');
                }
                if (vm.examinAddObj.dealType == null) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请选择交易类型';
                    return $util.inputFocus('dealType');
                }
                if (vm.examinAddObj.nm == null) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请输入合同名称';
                    return $util.inputFocus('nm');
                }
                if (vm.fileDos == '') {
                    vm.showErrorMessage = true;
                    return vm.erroeMessage = '请上传word模板';
                }
                if (vm.filePdf == '') {
                    vm.showErrorMessage = true;
                    return vm.erroeMessage = '请上传pdf模板';
                }
                vm.examinAddObj.id = $cookies.get('id');
                $layer.loading();
                $upload.upload({
                    url: $defaultConfig.app_uri + 'cntrct/addCntrct_1', //上传的url
                    data: {trackEditObj: angular.toJson(vm.examinAddObj), fileDos: vm.fileDos, filePdf: vm.filePdf}
                }).progress(function (evt) {//上传进度
                }).success(function (data, status, headers, config) {
                    if (data.code == '200' && data.errorMsg) {
                        return $layer.tip(data.errorMsg);
                    } else {
                        vm.showAdd = false;
                        vm.examinAddObj = {};
                        vm.inputTextDos = '点击上传文件';
                        vm.inputTextPdf = '点击上传文件';
                        vm.fileDos = '';
                        vm.filePdf = '';
                        $layer.tip('上传成功', 1000);
                        $timeout(function () {
                            vm.getPagedDataAsync();
                        }, 1000)
                    }
                }).error(function (data, status, headers, config) {
                    $layer.tip('服务器异常,请重新尝试');
                });
            };
            /**
             *下载
             * @param type         //下载类型
             **/
            vm.download = function (type) {
                vm.downloadObj = {
                    contrctTp: vm.contrctTp,
                    stTp: vm.stTp,
                    trdTp: vm.trdTp
                };
                $layer.loading();
                var header = {};
                header[$defaultConfig.header_token_code] = $cookies.get($defaultConfig.session_code);
                switch (type) {
                    case 'doc':
                        $http.post($defaultConfig.app_uri + 'cntrct/downloadsPro_1', {trackEditObj: angular.toJson(vm.downloadObj)}, {responseType: 'arraybuffer',headers:header}).then(function (response) {
                            var blob = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
                            var fileName = vm.nm + '.docx';
                            saveAs(blob, decodeURI(fileName));
                            $layer.close();
                        }, function () {
                            return $layer.tip('服务器异常,请重新尝试');
                        });
                        break;
                    case 'pdf':
                        $http.post($defaultConfig.app_uri + 'cntrct/downloadsPros_1', {trackEditObj: angular.toJson(vm.downloadObj)}, {responseType: 'arraybuffer',headers:header}).then(function (response) {
                            var blob = new Blob([response.data], {type: 'application/pdf'});
                            var fileName = vm.nm + '.pdf';
                            saveAs(blob, decodeURI(fileName));
                            $layer.close();
                        }, function () {
                            return $layer.tip('服务器异常,请重新尝试');
                        });
                        break;
                }
            }
        }]);
}());