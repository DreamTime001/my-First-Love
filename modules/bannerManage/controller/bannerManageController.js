(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('bannerManageController', ['$api', '$timeout', '$upload', '$http', '$state', '$scope', '$location', '$anchorScroll', '$cookies', '$layer', function ($api, $timeout, $upload, $http, $state, $scope, $location, $anchorScroll, $cookies, $layer) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            //当前页
            vm.currentPage = 1;
            //获取首页banner
            vm.init = function () {
                $api.get('cms/goIndexBannerPics', {pic_id: 2}, function (result) {
                    result.data ? vm.indexBannerList = result.data : vm.indexBannerList = [{base_String: ''}];
                });
            };
            /**
             * 切页
             * @param currentPage    当前第几页
             */
            vm.goPage = function (currentPage) {
                vm.currentPage = currentPage;
                if (vm.currentPage == 2) {
                    //获取合作伙伴banner
                    $api.get('cms/goPartnerPics', function (result) {
                        result.data ? vm.bannerObj = result.data : vm.bannerObj = [{
                            base_String: '',
                            ttl: '',
                            bLink: ''
                        }];
                    });
                }
            };
            //添加合作伙伴广告
            vm.addPartBaner = function () {
                vm.bannerObj.push({
                    ttl: '',
                    base_String: '',
                    bLink: '',
                    picNm: ''
                })
            };
            //添加主页轮播
            vm.addIndexBaner = function () {
                vm.indexBannerList.push({base_String: '', picNm: ''});
            };
            /**
             * 删除广告
             * @param type      0-合作伙伴
             *                      1-首页
             */
            vm.deleteBaner = function (index, type) {
                switch (type) {
                    case '0':
                        vm.bannerObj.splice(index, 1);
                        break;
                    case '1':
                        vm.indexBannerList.splice(index, 1);
                        break;
                }
            };
            $scope.reader = new FileReader();   //创建一个FileReader接口
            $scope.img_upload = function (files, even, type) {       //单次提交图片的函数
                var _index = $(even).attr('id');
                switch (type) {
                    case '0':
                        if (files[0]) {
                            if (files[0].size / 1024 <= 1024) {
                                vm.bannerObj[_index].picNm = files[0].name;
                                vm.bannerObj[_index].type = files[0].type;
                                $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
                                $scope.reader.onload = function (ev) {
                                    $scope.$apply(function () {
                                        vm.bannerObj[_index].base_String = ev.target.result
                                    });
                                }
                            } else {
                                $layer.tip('文件太大，请重新上传');
                            }
                        }
                        break;
                    case '1':
                        if (files[0]) {
                            if (files[0].size / 1024 <= 1024) {
                                vm.indexBannerList[_index].picNm = files[0].name;
                                vm.indexBannerList[_index].type = files[0].type;
                                $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
                                $scope.reader.onload = function (ev) {
                                    $scope.$apply(function () {
                                        vm.indexBannerList[_index].base_String = ev.target.result
                                    });
                                }
                            } else {
                                $layer.tip('文件太大，请重新上传');
                            }
                        }
                        break;
                }
            };
            /**
             * banner提交
             * @param type    0-合作伙伴
             *                 1-首页
             */
            vm.updateban = function (type) {
                switch (type) {
                    case '0':
                        $api.post('cms/addPartnerPics', {
                            bannerObj: angular.toJson(vm.bannerObj),
                            id: $cookies.get('id')
                        }, function (result) {
                            $layer.tip('修改成功', 1000);
                        });
                        break;
                    case '1':
                        $api.post('cms/bannerPics', {
                            bannerObj: angular.toJson(vm.indexBannerList),
                            pic_id: 2
                        }, function (result) {
                            $layer.tip('修改成功', 1000);
                        });
                        break;
                }
            }
        }])
}());