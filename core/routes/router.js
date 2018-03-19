(function () {
    'use strict';
    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/notFound.html');
                // $stateProvider
                //     .state('home', {
                //         url: '',
                //         templateUrl: 'modules/home/view/home.html'
                //     })
                //      .state('bank', {
                //         url: '/bank.html',
                //         templateUrl: 'modules/bank/view/bank.html'
                //     })
                //     .state('electronic', {
                //         url: '/electronic.html',
                //         templateUrl: 'modules/electronic/view/electronic.html'
                //     })
        }])
        .run(['$api', '$rootScope', '$defaultConfig', '$templateCache', function ($api, $rootScope, $defaultConfig, $templateCache) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                                //监听路由
                				// $templateCache.removeAll();
                				// $api.get('/checkSession', function(result) {
                				// 	if(!result) {
                				// 		window.location.href = $defaultConfig.current_uri + '/login.html';
                				// 	}
                				// })
            });
        }]);
}());