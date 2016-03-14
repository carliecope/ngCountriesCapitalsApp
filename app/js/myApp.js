angular.module('myApp', ['ngRoute', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl : 'templates/home.html',
			controller : 'HomeCtrl as home'
		}).when('/countries', {
			templateUrl : 'templates/countries.html',
			controller : 'CountriesCtrl as countries'
		}).when('/country', {
			templateUrl : 'templates/country.html',
			controller : 'CountryCtrl as country'
		}).otherwise('error', {
			template: '<p>Error - Page not Found</p>'
		});
	}])
	.controller('HomeCtrl', ['$scope', function($scope) {

	}])
	.controller('CountriesCtrl', ['$scope', function($scope) {

	}])
	.controller('CountryCtrl', ['$scope', function($scope) {

	}]);