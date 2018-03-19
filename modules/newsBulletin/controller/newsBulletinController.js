(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('newsBulletinController', ['$api', '$timeout', '$upload', '$http', '$state', '$layer', '$scope', '$cookies', function ($api, $timeout, $upload, $http, $state, $layer, $scope, $cookies) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
            vm.showNewsMes = false;//新闻编辑
            vm.showErrorMessage = false;
            vm.showAlert = false;
            vm.erroeMessage = '';
            //查询条件
            vm.query = {
                ttl: '',
                times: '',
                pageNum: 1,
                pageSize: 10
            };
            //新闻信息
            vm.newsObj = {
                id: '',
                createTime: '',
                ttl: '',
                nt: '',
                imgNm: '',
                link: '',
                type: '',
                base_String: ''
            };
            //日期初始化
            initDate('#times', 'yyyy-mm-dd', 2);
            //获取列表
            vm.getPagedDataAsync = function () {
                vm.sid = '';
                $api.post('cms/goAddNwsmng', {query: angular.toJson(vm.query)}, function (result) {
                    vm.list = result.data.list;
                    for (var i = 0; i < vm.list.length; i++) {
                        vm.list[i].checked = false;//添加默认选中状态
                        vm.list[i].createTime = vm.list[i].createTime.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                    }
                    vm.query.pages = result.data.pages;
                })
            };

//-----------------------------------------------------------分割线------------------------------------------------------------------------------------------------------------//
            //单选框
            vm.selectThis = function (obj) {
                for (var i = 0; i < vm.list.length; i++) {
                    vm.list[i].checked = false;
                }
                obj.checked = true;
                vm.sid = obj.sid;//新闻的标号
            };
            //查询
            vm.submit = function () {
                vm.query.pageNum = 1;
                vm.getPagedDataAsync();
            };
            //重置
            vm.resetQuery = function () {
                vm.query = {
                    ttl: '',
                    times: '',
                    pageNum: 1,
                    pageSize: 10
                }
            };
            //关闭
            vm.closePop = function () {
                vm.showNewsMes = false;
                vm.showErrorMessage = false;
                vm.erroeMessage = '';
                vm.showAlert = false;
                $scope.thumb = [];
                vm.newsObj = {
                    id: '',
                    createTime: '',
                    ttl: '',
                    nt: '',
                    imgNm: '',
                    link: '',
                    type: '',
                    base_String: ''
                };//清空页面上绑定的数据
                $scope.addIcon = true;//添加按钮状态
            };
            /**
             * 新增 || 修改 弹出层
             * @param type        add - 新增
             *                     edit - 修改
             */
            vm.showNewsMesPop = function (type) {
                switch (type) {
                    case 'add':
                        vm.showNewsMes = true;
                        vm.iconType = 'add';
                        vm.titleView = '新增新闻';
                        //日期初始化
                        $timeout(function () {
                            initDate('#createTime', 'yyyy-mm-dd', 2);
                        }, 500);
                        break;
                    case 'edit':
                        if (vm.sid) {
                            vm.showNewsMes = true;
                            vm.iconType = 'edit';
                            vm.titleView = '修改新闻';
                            $api.post('cms/seekNwsmng', {sid: vm.sid}, function (result) {
                                vm.newsObj = result.data.newsObj;
                                vm.newsObj.createTime = vm.newsObj.createTime.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');//日期转换
                                if (vm.newsObj.base_String) {
                                    $scope.thumb[0] = vm.newsObj.base_String;
                                    $scope.addIcon = false
                                }
                            });
                            //日期初始化
                            $timeout(function () {
                                initDate('#createTime', 'yyyy-mm-dd', 2);
                            }, 500);
                        } else {
                            $layer.tip('请选择一往篇新闻');
                        }
                }
            };

            // 图片上传
            $scope.addIcon = true;//添加按钮状态
            $scope.reader = new FileReader();   //创建一个FileReader接口
            $scope.thumb = [];//存放base64图片
            //选择图片
            $scope.img_upload = function (files, maxNum) {       //单次提交图片的函数
                if (files[0]) {
                    vm.newsObj.type = files[0].type;
                    vm.newsObj.imgNm = files[0].name;
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
                vm.iconDelete = 'imgDele';
                vm.showAlert = true;
                $scope.delete = function () {
                    $scope.thumb.splice(key, 1);
                    $scope.thumb.length > 0 ? $scope.buttonDis = false : $scope.buttonDis = true;
                    $scope.thumb.length >= maxNum ? $scope.addIcon = false : $scope.addIcon = true;
                    vm.showAlert = false;
                };
            };

            //新增确定按钮
            vm.toAdd = function () {
                vm.newsObj.id = $cookies.get('id');
                vm.newsObj.base_String = $scope.thumb[0];
                $api.post('cms/addNwsmng', {newsObj: angular.toJson(vm.newsObj)}, function (result) {
                    vm.showNewsMes = false;
                    $scope.addIcon = true;//添加按钮状态
                    $scope.thumb = [];
                    vm.newsObj = {
                        id: '',
                        createTime: '',
                        ttl: '',
                        nt: '',
                        imgNm: '',
                        link: '',
                        type: '',
                        base_String: ''
                    };//清空页面上绑定的数据
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //修改确定按钮
            vm.toEdit = function () {
                vm.newsObj.id = $cookies.get('id');
                vm.newsObj.base_String = $scope.thumb[0];
                vm.newsObj.sid = vm.sid;
                $api.post('cms/eidtNwsmng', {newsObj: angular.toJson(vm.newsObj)}, function (result) {
                    vm.showNewsMes = false;
                    $scope.thumb = [];
                    vm.newsObj = {
                        id: '',
                        createTime: '',
                        ttl: '',
                        nt: '',
                        imgNm: '',
                        link: '',
                        type: '',
                        base_String: ''
                    };//清空页面上绑定的数据
                    $layer.tip('提交成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
            //新闻删除层
            vm.showAlertPop = function () {
                if (vm.sid) {
                    vm.showAlert = true;
                    vm.iconDelete = 'newsDele';
                } else {
                    $layer.tip('请先选择一条数据');
                }
            };
            //确认删除
            vm.toDelete = function () {
                $api.post('cms/deleteNews', {sid: vm.sid}, function (result) {
                    vm.showAlert = false;
                    $layer.tip('删除成功', 1000);
                    $timeout(function () {
                        vm.getPagedDataAsync();
                    }, 1000);
                })
            };
        }])
}());