angular.module('myApp', ['ngRoute', 'ngAnimate', 'DataServices', 'Data'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl : 'templates/home.html',
			controller : 'HomeCtrl'
		}).when('/countries', {
			templateUrl : 'templates/countries.html',
			controller : 'CountriesCtrl'
		}).when('/countries/:countryCode', {
			templateUrl : 'templates/country.html',
			controller : 'CountryCtrl' 
		}).otherwise('error', {
			template: '<p>Error - Page not Found</p>'
		});
	}])
	.controller('HomeCtrl', ['$scope', '$location', function($scope, $location) {

		$scope.viewCountries = function() {
			$location.path('/countries');
		};
	}])
	.controller('CountriesCtrl', ['$scope', '$location', '$q', 'countryData', function($scope, $location, $q, countryData) {
		'use strict';

		//turn objects into strings and store in variable
  		var toString = Object.prototype.toString;

		//Did API call return any data?
		$q.when(countryData.countries).then(function(result){

			//If we did get data back, is it an object?
			if(toString.call(countryData.countries)=='[object Object]') {
			  countryData.countries = result.geonames;
			}
			$scope.countries = countryData.countries;
		});

		$scope.toCountry = function(country) {

			$location.path('/countries/'+ country.countryCode);
		}; 
		$scope.toHome = function() {
			$location.path('/');
		};
	}])
	.controller('CountryCtrl', ['$scope', '$location', '$route', 'countryData', function($scope, $location, $route, countryData) {
		
		countryData.getCountry($route.current.params.countryCode).then(function(result){
    		$scope.country=result[0];
 		});

 		countryData.getCapitals($route.current.params.countryCode).then(function(result){
		    $scope.capital = result;
		    $scope.capitalPopulation = $scope.capital.population;
		});

		countryData.getNeighbors($route.current.params.countryCode).then(function(result){
			$scope.neighbors = result.geonames;
		});

		$scope.flag = $route.current.params.countryCode.toLowerCase();
		$scope.map = $route.current.params.countryCode;
		
		$scope.backToCountries = function() {
			$location.path('/countries');
		}; 

		$scope.toHome = function() {
			$location.path('/');
		}; 
	}]);





