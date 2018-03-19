(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('contractManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$layer', '$cookies', '$scope', '$defaultConfig', '$util', function ($api, $timeout, $upload, $http, $state, $layer, $cookies, $scope, $defaultConfig, $util) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showContractInfo = false;
            vm.showAddtrace = false;
            vm.erroeMessage = '';
            vm.showErrorMessage = false;
            vm.showTrackList = false;
            vm.showUnder = false;
            //查询条件
            vm.query = {
                itp: '',
                ists: '',
                isgn_w: '',
                orgAndpj: '',
                stlgctp: '',
                pageNum: 1,
                pageSize: 10
            };
            //合同提交对象
            vm.addtrace = {
                cntrct_dt: '',
                cntrct_inf: ''
            };
            //合同类型
            vm.itpList = [
                {
                    itp: '0',
                    name: '交易合同'
                },
                {
                    itp: '1',
                    name: '平台服务合同'
                }
            ];
            //资产分类
            vm.stlgctpList = [
                {
                    stlgctp: '1',
                    name: '一般金融资产'
                },
                {
                    stlgctp: '9',
                    name: '要约交易'
                }
            ];
            //签署方式
            vm.isgn_wList = [
                {
                    isgn_w: '1',
                    name: '线上'
                },
                {
                    isgn_w: '2',
                    name: '线下'
                }
            ];
            //获得合同状态
            vm.getIsts = function () {
                $api.get('cntrct/getContractStatus_1', function (result) {
                    console.log(result);
                    vm.istsList = result.data;
                });
            };

            //获取列表
            vm.getPagedDataAsync = function () {
                vm.cntrct_cd = '';
                if (vm.query.stlgctp) {
                    vm.query.reviewType == 1 ? vm.ty = 1 : vm.ty = 9;
                    $api.post('cntrct/cntrctList_1', {query: angular.toJson(vm.query)}, function (result) {
                        vm.list = result.data.list;
                        for (var i = 0; i < vm.list.length; i++) {
                            vm.list[i].checked = false;//添加默认选中状态
                            vm.list[i].cntrct_crt_dt = vm.list[i].cntrct_crt_dt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                        }
                        vm.query.pages = result.data.pages;
                    })
                } else {
                    return $layer.tip('请选择资产分类');
                }
            };

//--------------------------------------------------------------------分割线---------------------------------------------------------------------------------------------//

            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.cntrct_cd = obj.cntrct_cd;
                vm.st_nm = obj.st_nm;//项目名
                vm.cmp_nm = obj.cmp_nm;//卖方
                vm.cmp_nm_b = obj.cmp_nm_b;//买方
                vm.timeStamp = obj.timeStamp;
                vm.sgn_w = obj.sgn_w;
                vm.st_cd = obj.st_cd;
            };
            //查询
            vm.submit = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    itp: '',
                    ists: '',
                    isgn_w: '',
                    orgAndpj: '',
                    stlgctp: '',
                    pageNum: 1,
                    pageSize: 10
                };
            };
            //关闭
            vm.closePop = function () {
                vm.showErrorMessage = false;
                vm.erroeMessage = '';
                vm.showContractInfo = false;
                vm.showAddtrace = false;
                vm.showTrackList = false;
                vm.showUnder = false;
                vm.addtrace = {
                    cntrct_dt: '',
                    cntrct_inf: ''
                };
            };
            //查看编辑框
            vm.showContractInfoPop = function () {
                if (vm.cntrct_cd) {
                    vm.showContractInfo = true;
                    vm.titleView = '合同信息';
                    $api.post('cntrct/getContractInfo_1', {cntrct_cd: vm.cntrct_cd}, function (result) {
                        vm.contractInfoList = result.data;
                        vm.contractInfoList.frst_pymnt_lmt ? vm.contractInfoList.frst_pymnt_lmt = vm.contractInfoList.frst_pymnt_lmt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3') : null;
                        vm.contractInfoList.scnd_pymnt_lmt ? vm.contractInfoList.scnd_pymnt_lmt = vm.contractInfoList.scnd_pymnt_lmt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3') : null;
                        vm.contractInfoList.th_pymnt_lmt ? vm.contractInfoList.th_pymnt_lmt = vm.contractInfoList.th_pymnt_lmt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3') : null;
                        $timeout(function () {
                            initDate('#frst_pymnt_lmt', 'yyyy-mm-dd', 2);
                            initDate('#scnd_pymnt_lmt', 'yyyy-mm-dd', 2);
                            initDate('#th_pymnt_lmt', 'yyyy-mm-dd', 2);
                        }, 500);
                    })
                } else {
                    return $layer.tip('请选择一条数据')
                }
            };
            //合同编辑确认按钮
            vm.toContractInfo = function () {
                $api.post('cntrct/genCntrct_1', {
                    trackEditObj: angular.toJson(vm.contractInfoList), id: $cookies.get('id')
                }, function (result) {
                    vm.showContractInfo = false;
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //合同追踪框
            vm.showAddtracePop = function () {
                if (vm.cntrct_cd) {
                    vm.showAddtrace = true;
                    vm.titleView = '合同详情';
                    $timeout(function () {
                        initDate('#cntrct_dt', 'yyyy-mm-dd', 2);
                    }, 500);
                } else {
                    return $layer.tip('请选择一条数据')
                }
            };
            // 图片上传
            $scope.addIcon = true;//添加按钮状态
            $scope.reader = new FileReader();   //创建一个FileReader接口
            $scope.thumb = [];//存放base64图片
            //选择图片
            $scope.img_upload = function (files, maxNum) {       //单次提交图片的函数
                if (files[0]) {
                    vm.addtrace.type = files[0].type;
                    vm.addtrace.picNm = files[0].name;
                    $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
                    $scope.reader.onload = function (ev) {
                        $scope.$apply(function () {
                            $scope.thumb.push(ev.target.result);
                            vm.addtrace.base_String = $scope.thumb[0];
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
            //合同追踪确认按钮
            vm.toAddtrace = function () {
                angular.element('.form-control').removeClass('has-error');
                if (vm.addtrace.cntrct_dt == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '请选择追踪时间';
                    return $util.inputFocus('cntrct_dt');
                }
                if (vm.addtrace.cntrct_inf == '') {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '追踪记录不能为空';
                    return $util.inputFocus('cntrct_inf');
                }
                if ($scope.thumb.length == 0) {
                    vm.showErrorMessage = true;
                    vm.erroeMessage = '相关附件不能为空';
                    return false;
                }
                vm.addtrace.cntrct_cd = vm.cntrct_cd;
                vm.addtrace.id = $cookies.get('id');
                $api.post('cntrct/addtrace_1', {
                    trackEditObj: angular.toJson(vm.addtrace)
                }, function (result) {
                    vm.showAddtrace = false;
                    $scope.thumb = [];
                    $scope.addIcon = true;
                    vm.showErrorMessage = false;
                    vm.erroeMessage = '';
                    vm.addtrace = {
                        cntrct_dt: '',
                        cntrct_inf: ''
                    };
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                });
            };
            //关闭层
            vm.closePopPic = function () {
                vm.showAlert = false;
            };
            //追求记录框
            vm.showTrackListPop = function () {
                if (vm.cntrct_cd) {
                    $api.post('cntrct/ctrecord_1', {
                        cntrct_cd: vm.cntrct_cd
                    }, function (result) {
                        if (result.errorMsg) {
                            return $layer.tip(result.errorMsg);
                        } else {
                            vm.showTrackList = true;
                            vm.titleView = '日志追踪';
                            vm.popLogList = result.data.bdList;
                            for (var i = 0; i < vm.popLogList.length; i++) {
                                vm.popLogList[i].dt = vm.popLogList[i].dt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
                            }
                        }
                    });
                } else {
                    return $layer.tip('请选择一条数据')
                }
            };
            /**
             * 下载图片
             * @param sid               获得当前数据的sid
             * @param fileName          获取当前图片文件名
             */
            vm.downloadPic = function (sid, fileName) {
                $layer.loading();
                var fileType = fileName.slice(-3);
                $http.post($defaultConfig.app_uri + 'cntrct/downloadFile_1', {
                    cntrct_cd: vm.cntrct_cd,
                    sid: sid
                }, {responseType: 'arraybuffer'}).then(function (response) {
                    switch (fileType) {
                        case 'png':
                            var blob = new Blob([response.data], {type: 'application/x-png'});
                            saveAs(blob, decodeURI(fileName));
                            $layer.close();
                            break;
                        case 'jpg':
                            var blob = new Blob([response.data], {type: 'application/x-jpg'});
                            saveAs(blob, decodeURI(fileName));
                            $layer.close();
                            break;
                    }
                })
            };
            //下载ZIP
            vm.downloadZip = function () {
                if (vm.cntrct_cd) {
                    $layer.loading();
                    var header = {};
                    header[$defaultConfig.header_token_code] = $cookies.get($defaultConfig.session_code);
                    $http.post($defaultConfig.app_uri + 'cntrct/download_1', {
                        cntrct_cd: vm.cntrct_cd
                    }, {responseType: 'arraybuffer',headers:header}).then(function (response) {
                        var blob = new Blob([response.data], {type: 'application/zip'});
                        var fileName = '合同文件' + vm.timeStamp;
                        saveAs(blob, decodeURI(fileName));
                        $layer.close();
                    }, function (resp) {
                        console.log(resp);
                        $layer.close();
                        $layer.tip('服务器异常,请重新尝试');
                    })
                } else {
                    return $layer.tip('请选择一条数据')
                }
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
            vm.inputText = "点击这里上传文件";//input框默认显示文字
            vm.file = '';
            //获取文件
            vm.onFileSelect = function ($files) {    //$files:是已选文件的名称、大小和类型的数组
                vm.file = $files[0];
                vm.inputText = vm.file.name;
            };
            //上传线下合同框
            vm.showUnderPop = function () {
                if (vm.cntrct_cd) {
                    if (vm.sgn_w == '2') {
                        vm.showUnder = true;
                        vm.titleView = '资料上传';
                    } else {
                        return $layer.tip('只有线下方式才能上传合同');
                    }
                } else {
                    return $layer.tip('请选择一条数据')
                }
            };
            //线下合同确认按钮
            vm.toUnder = function () {
                vm.underObj = {};
                vm.underObj.cntrct_cd = vm.cntrct_cd;
                vm.underObj.st_cd = vm.st_cd;
                vm.underObj.id = $cookies.get('id');
                $layer.loading();
                $upload.upload({
                    url: $defaultConfig.app_uri + 'cntrct/updateoffline_1', //上传的url
                    data: {trackEditObj: angular.toJson(vm.underObj)},
                    file: vm.file
                }).progress(function (evt) {//上传进度
                }).success(function (data, status, headers, config) {
                    if (data.code == '200') {
                        vm.showUnder = false;
                        vm.underObj = {};
                        vm.inputText = '点击这里上传文件';
                        $layer.tip('上传成功', 1000);
                        $timeout(function () {
                            vm.getPagedDataAsync();
                        }, 1000)
                    }
                }).error(function (data, status, headers, config) {
                    $layer.tip('服务器异常,请重新尝试');
                });
            }
        }])
}());