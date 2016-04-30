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
		var code = "";
		
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
			},
			setCode: function(newCode) {
				code = newCode;
			},
			getCode: function() {
				return code;
			}
		};
	})
	.controller('HomeCtrl', ['$scope', '$location', function($scope, $location) {
		$scope.header_home = true;

		$scope.viewCountries = function() {
			console.log("view countries");
			$location.path('/countries');
		};
	}])
	.controller('CountriesCtrl', ['$scope', '$http', '$location', 'currentCountry', function($scope, $http, $location, currentCountry) {
		$scope.header_home = false;

		//Get countries list from 'countryInfo' endpoint
		$http.get(
			'http://api.geonames.org/countryInfoJSON?username=carliecope', { cache: true }
			).then(function(response) {
				console.log(response);
				var ctryList = response.data.geonames;

				for(i = 0; i < ctryList.length; i++) {
					if(ctryList[i].capital === "") {
						ctryList.splice(i, 1);
					}
				}
				$scope.ctryList = ctryList;
			}, function(response) {
				console.log('error');
			});

		$scope.toCountry = function(country, capital, geonameId, population, area, code) {
			currentCountry.setGeonameId(geonameId);
			currentCountry.setCtryPop(population);
			currentCountry.setCtryArea(area);
			currentCountry.setCountry(country);
			currentCountry.setCapital(capital);
			currentCountry.setCode(code);

			$location.path('/countries/' + country + '/' + capital);
		}; 
		$scope.toHome = function() {
			$location.path('/');
		};
	}])
	.controller('CountryCtrl', ['$scope', '$http', '$routeParams', '$location', 'currentCountry', function($scope, $http, $routeParams, $location, currentCountry) {
		$scope.header_home = false;

		//Scope variables 
		$scope.country = currentCountry.getCountry();

		$scope.capital = currentCountry.getCapital();

		$scope.ctryPop = currentCountry.getCtryPop();

		$scope.ctryArea = currentCountry.getCtryArea();

		$scope.geonameId = currentCountry.getGeonameId();

		$scope.codeUpperCase = currentCountry.getCode();

		$scope.codeLowerCase = currentCountry.getCode().toLowerCase();

		//Get capital population from 'search' endpoint
		var requestSearch = {
			name_equals: $scope.capital,
			isNameRequired: true
		};

		$http({
			url: 'http://api.geonames.org/searchJSON?q=' + $scope.capital + '&featureCode=PPLC&maxRows=10&username=carliecope',
			method: 'GET',
			params: requestSearch,
			}).then(function(response) {

				console.log(response);

				if(response.data.geonames.length !== 0) {
					$scope.capitalPop = response.data.geonames[0].population;

				} else {
					$scope.capitalPop = "NA";
				}
				
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
		}).then(function(response) {
			console.log(response);
			$scope.neighborNum = response.data.geonames.length;

			var neighbors = [];

			for(i=0; i < $scope.neighborNum; i++) {
				neighbors.push(response.data.geonames[i].countryName);
				$scope.neighbors = neighbors.join(', ');
			}
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





