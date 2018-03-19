(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('registrationOffer', {
                    url: '/registrationOffer.html',
                    templateUrl: 'modules/registrationOffer/view/registrationOffer.html'
				})
		}])
}());