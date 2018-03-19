(function() {
	'use strict';
	angular.module('app')
		.config(['$stateProvider', '$ocLazyLoadProvider', function($stateProvider, $ocLazyLoadProvider) {
			$stateProvider
				.state('knowledgeBaseManage', {
                    url: '/knowledgeBaseManage.html',
                    templateUrl: 'modules/knowledgeBaseManage/view/knowledgeBaseManage.html'
				})
		}])
}());