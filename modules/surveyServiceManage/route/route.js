(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('surveyServiceManage', {
                    url: '/surveyServiceManage.html',
                    templateUrl: 'modules/surveyServiceManage/view/surveyServiceManage.html'
				})
		}])
}());