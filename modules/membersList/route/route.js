(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('membersList', {
                    url: '/membersList.html',
                    templateUrl: 'modules/membersList/view/membersList.html'
				})
		}])
}());