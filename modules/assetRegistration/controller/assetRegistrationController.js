(function () {
    'use strict';
    angular.module('app.controllers')
        .controller('assetRegistrationController', ['$api', '$timeout', '$upload', '$http','$state', function ($api, $timeout, $upload, $http,$state) {
            var vm = this;
            $timeout(function () {
                initMenu();
            }, 100);
        }])
}());