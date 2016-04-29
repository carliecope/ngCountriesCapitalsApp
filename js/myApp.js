angular.module('myApp', ['ngRoute', 'ngAnimate'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl : 'templates/home.html',
			controller : 'HomeCtrl as home'
		}).when('/countries', {
			templateUrl : 'templates/countries.html',
			controller : 'CountriesCtrl as countries'
		}).when('/countries/:country/:capital', {
			templateUrl : 'templates/country.html',
			controller : 'CountryCtrl' // as country'
		}).otherwise('error', {
			template: '<p>Error - Page not Found</p>'
		});
	}])
	.factory('currentCountry', function() {
		var ctryPop = 0;
		var ctryArea = 0;
		var geonameId = 0;
		var capital = "";
		var country = "";
		
		return {
			setCtryPop: function(population) {
				ctryPop = population;
			},
			getCtryPop: function() {
				return ctryPop;
			},
			setCtryArea: function(area) {
				ctryArea = area;
			},
			getCtryArea: function() {
				return ctryArea;
			},
			setGeonameId: function(id) {
				geonameId = id;
			},
			getGeonameId: function() {
				return geonameId;
			},
			setCountry: function(newCountry) {
				country = newCountry;
			},
			getCountry: function() {
				return country;
			},
			setCapital: function(newCapital) {
				capital = newCapital;
			},
			getCapital: function() {
				return capital;
			}
		};
	})
	.controller('HomeCtrl', ['$scope', '$location', function($scope, $location) {

		$scope.viewCountries = function() {
			console.log("view countries");
			$location.path('/countries');
		};
	}])
	.controller('CountriesCtrl', ['$scope', '$http', '$location', 'currentCountry', function($scope, $http, $location, currentCountry) {
		
		//Get countries list from 'countryInfo' endpoint
		$http.get(
			'http://api.geonames.org/countryInfoJSON?username=carliecope'
			).then(function(response) {
				console.log(response);
				$scope.ctryList = response.data.geonames;
			}, function(response) {
				console.log('error');
			});

		$scope.toCountry = function(country, capital, geonameId, population, area) {
			currentCountry.setGeonameId(geonameId);
			currentCountry.setCtryPop(population);
			currentCountry.setCtryArea(area);
			currentCountry.setCountry(country);
			currentCountry.setCapital(capital);

			$location.path('/countries/' + country + '/' + capital);
		}; 
	}])
	.controller('CountryCtrl', ['$scope', '$http', '$routeParams', '$location', 'currentCountry', function($scope, $http, $routeParams, $location, currentCountry) {
		//Scope variables 
		$scope.country = currentCountry.getCountry();
		console.log($scope.country);
		$scope.capital = currentCountry.getCapital();
		$scope.ctryPop = currentCountry.getCtryPop();
		$scope.ctryArea = currentCountry.getCtryArea();
		$scope.geonameId = currentCountry.getGeonameId();

		//Get capital population from 'search' endpoint
		var requestSearch = {
			name_equals: $scope.country,
			isNameRequired: true
		};

		$http({
			url: 'http://api.geonames.org/searchJSON?q=' + $scope.country + '&maxRows=10&username=carliecope',
			method: 'GET',
			params: requestSearch,
			// cache: true
			}).then(function(response) {
				console.log(response);

				for(i = 0; i < response.data.geonames.length; i++) {

					// if (response.data.geonames[i].countryName.valueOf() === $scope.country.valueOf()) {
					// 	$scope.capitalPop = response.data.geonames[i].population;
					// 	console.log($scope.capitalPop);
					// }
				}
				console.log($scope.country);
			}, function(response) {
				console.log('error');
			});

		//Get neighbors from 'neighbors' endpoint 
		var requestNeighbors = {
			geonameId: $scope.geonameId
		};
		// http://api.geonames.org/neighbours?geonameId=2658434&username=demo
		$http({
			url: 'http://api.geonames.org/neighboursJSON?geonameId=' + $scope.geonameId + '&username=carliecope',
			method: 'GET',
			params: requestNeighbors,
			// cache: true
		}).then(function(response) {
			console.log(response);
			$scope.neighborNum = response.data.geonames.length;
			$scope.neighbors = [];

			for(i=0; i < $scope.neighborNum; i++) {
				$scope.neighbors.push(response.data.geonames[i].countryName); 
			}

			console.log($scope.neighborNum, $scope.neighbors);
			console.log($scope.country);
		}, function(response) {
			console.log('error');
		});

		$scope.backToCountries = function() {

			$location.path('/countries');
		}; 

		$scope.toHome = function() {

			$location.path('/');
		}; 
	}]);





