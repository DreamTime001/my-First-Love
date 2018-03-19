(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				//酒店信息维护-列表
				.state('notFound', {
                    url: '/notFound.html',
                    templateUrl: 'modules/notFound/view/notFound.html'
				})

		}])
}());