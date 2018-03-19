(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('uploadBestMes', {
                    url: '/uploadBestMes.html',
                    templateUrl: 'modules/uploadBestMes/view/uploadBestMes.html'
				})
		}])
}());