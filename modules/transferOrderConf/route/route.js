(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('transferOrderConf', {
                    url: '/transferOrderConf.html',
                    templateUrl: 'modules/transferOrderConf/view/transferOrderConf.html'
				})
		}])
}());