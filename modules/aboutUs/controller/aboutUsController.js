(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('aboutUsController', ['$api', '$timeout', '$upload', '$http', '$state','$scope', function ($api, $timeout, $upload, $http, $state,$scope) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);


            vm.config={
                //初始化编辑器内容
                content : '',
                //是否聚焦 focus默认为false
                focus : true,
                //首行缩进距离,默认是2em
                indentValue:'2em',
                //初始化编辑器宽度,默认1000
                initialFrameWidth:'100%',
                //初始化编辑器高度,默认320
                initialFrameHeight:320,
                //编辑器初始化结束后,编辑区域是否是只读的，默认是false
                readonly : false,
                //启用自动保存
                enableAutoSave: false,
                //自动保存间隔时间， 单位ms
                saveInterval: 50000000,
                //是否开启初始化时即全屏，默认关闭
                fullscreen : false,
                //图片操作的浮层开关，默认打开
                imagePopup:true,
                //提交到后台的数据是否包含整个html字符串
                allHtmlEnabled:false,//额外功能添加
                functions :[]
        };





            // vm.content = {};
            // vm.ready = function (editor) {
            //     console.log(editor.getContent());
            // };
            // vm.submit = function(){
            //     console.log(vm.content)
            // }
        }])
}());