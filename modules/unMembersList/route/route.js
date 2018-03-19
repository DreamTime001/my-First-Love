(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('unMembersList', {
                    url: '/unMembersList.html',
                    templateUrl: 'modules/unMembersList/view/unMembersList.html'
				})
		}])
}());