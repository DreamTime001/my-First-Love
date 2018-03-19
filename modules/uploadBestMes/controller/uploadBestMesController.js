(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('uploadBestMesController', ['$api', '$timeout', '$upload', '$http', '$state', '$cookies', '$location', '$anchorScroll', '$scope', '$layer', function ($api, $timeout, $upload, $http, $state, $cookies, $location, $anchorScroll, $scope, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
                $('.subMenu li').each(function () {
                    if ($(this).attr('ui-sref') == 'surveyServiceManage') {
                        $(this).addClass('hover');
                        $(this).parents('ul').prev().find('i').addClass('on');
                    }
                })
            }, 100);
            vm.showAlertPop = false;
            vm.imgMax = 1;
            vm.jdLsMge = {
                is_contr: 0,
                is_char: 0,
                is_split: 0,
                pre_tion: 0,
                auction: 0,
                is_moge: 0,
                is_pc: 0,
                is_cf: 0,
                court_review: 0
            };
            vm.currentPage = 1;//当前页
            //默认获取资产信息
            vm.init = function () {
                vm.bestTuneObj = $cookies.get('bestTuneObj');
                $api.post('service/gotoDue_jd', {bestTuneObj: vm.bestTuneObj}, function (result) {
                    vm.astInfo = result.data.astInfo;
                    vm.astMap = result.data.astMap;
                    vm.jdsts = result.data.jdsts;
                    vm.srvc_tp = result.data.srvc_tp;//判断评估信息是否显示
                    result.data.jdPgMesge ? vm.jdPgMesgeObj = result.data.jdPgMesge : vm.jdPgMesgeObj = {};
                    result.data.jdLsMge ? vm.jdLsMge = result.data.jdLsMge : null;
                    vm.jdLsMge.downloadParam = result.data.downloadParam;
                    vm.jdLsMge.id = $cookies.get('id');
                    vm.jdPgMesgeObj.downloadParam = result.data.downloadParam;
                    vm.jdPgMesgeObj.id = $cookies.get('id');
                    if (result.data.jdLsMge.imgBase) {
                        $scope.thumb[0] = result.data.jdLsMge.imgBase;
                        $scope.addIcon = false
                    }
                });
            };
//------------------------------------------------------------------------------------------- 分割线 --------------------------------------------------------------------//
            // 图片上传
            $scope.addIcon = true;//添加按钮状态
            $scope.reader = new FileReader();   //创建一个FileReader接口
            $scope.thumb = [];//存放base64图片
            //选择图片
            $scope.img_upload = function (files, maxNum) {       //单次提交图片的函数
                if (files[0]) {
                    vm.jdLsMge.pic_type = files[0].type;
                    $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
                    $scope.reader.onload = function (ev) {
                        $scope.$apply(function () {
                            $scope.thumb.push(ev.target.result);
                            $scope.thumb.length > 0 ? $scope.buttonDis = false : $scope.buttonDis = true;
                            $scope.thumb.length >= maxNum ? $scope.addIcon = false : $scope.addIcon = true;
                        });
                    };
                }
            };
            //删除
            $scope.img_del = function (key, maxNum) {
                vm.showAlertPop = true;
                $scope.delete = function () {
                    $scope.thumb.splice(key, 1);
                    $scope.thumb.length > 0 ? $scope.buttonDis = false : $scope.buttonDis = true;
                    $scope.thumb.length >= maxNum ? $scope.addIcon = false : $scope.addIcon = true;
                    vm.showAlertPop = false;
                };
            };
            //关闭层
            vm.closePop = function () {
                vm.showAlertPop = false;
            };
            /**
             * 切页
             * @param currentPage    当前第几页
             */
            vm.goPage = function (currentPage) {
                vm.currentPage = currentPage;
            };
            /**
             * 提交
             * @param type    律所提供-jdLsMge
             *                 评估信息-jdPgMesge
             */
            vm.submit = function (type) {
                switch (type) {
                    case 'jdLsMge':
                        vm.jdLsMge.imgBase = $scope.thumb[0];
                        $api.post('service/uploadjds', {jdLsMgeObj: angular.toJson(vm.jdLsMge)}, function (result) {
                            $layer.tip('提交成功');
                        });
                        break;
                    case 'jdPgMesge':
                        $api.post('service/uploadpg', {jdPgMesgeObj: angular.toJson(vm.jdPgMesgeObj)}, function (result) {
                            $layer.tip('提交成功');
                        });
                        break;
                }
            };
            /**
             * 完成
             * @param type    律所提供-jdLsMge
             *                 评估信息-jdPgMesge
             */
            vm.done = function (type) {
                switch (type) {
                    case 'jdLsMge':
                        vm.jdLsMge.imgBase = $scope.thumb[0];
                        vm.jdLsMge.close_flag = 0;
                        $api.post('service/uploadjds', {jdLsMgeObj: angular.toJson(vm.jdLsMge)}, function (result) {
                            $layer.tip('提交成功');
                            vm.jdsts = 5;
                        });
                        break;
                    case 'jdPgMesge':
                        vm.jdPgMesgeObj.close_flag = 0;
                        $api.post('service/uploadpg', {jdPgMesgeObj: angular.toJson(vm.jdPgMesgeObj)}, function (result) {
                            $layer.tip('提交成功');
                            vm.jdsts = 7;
                        });
                        break;
                }
            };
        }])
}());