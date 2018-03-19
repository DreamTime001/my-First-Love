(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('assetAudit', {
                    url: '/assetAudit.html',
                    templateUrl: 'modules/assetAudit/view/assetAudit.html'
				})
		}])
}());