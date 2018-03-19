(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('surveyTempUp', {
                    url: '/surveyTempUp.html',
                    templateUrl: 'modules/surveyTempUp/view/surveyTempUp.html'
				})
		}])
}());