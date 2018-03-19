(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('membershipAudit', {
                    url: '/membershipAudit.html',
                    templateUrl: 'modules/membershipAudit/view/membershipAudit.html'
				})
		}])
}());