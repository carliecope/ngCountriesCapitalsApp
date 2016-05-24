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
	.factory('currentCountry', ['$cacheFactory', function($cacheFactory) {
		var cache = $cacheFactory();
		
		var put = function(key, value) {
		
			cache.put(key, angular.isUndefined(value) ? null : value);
		};
		var get = function(key) {
			return cache.get(key);
		};
		
		return {
			setCtryPop: function(population) {
				put('ctryPop', population);
			},
			getCtryPop: function() {
				return get('ctryPop');
			},
			setCtryArea: function(area) {
				put('ctryArea', area);
			},
			getCtryArea: function() {
				return get('ctryArea');
			},
			setGeonameId: function(id) {
				put('geonameId', id);
			},
			getGeonameId: function() {
				return get('geonameId');
			},
			setCountry: function(newCountry) {
				put('country', newCountry);
			},
			getCountry: function() {
				return get('country');
			},
			setCapital: function(newCapital) {
				put('capital', newCapital);
			},
			getCapital: function() {
				return get('capital');
			},
			setCode: function(newCode) {
				put('code', newCode);
			},
			getCode: function() {
				return get('code');
			},
			setLowerCaseCode: function(newCode) {
				put('toLowerCaseCode', newCode);
			},
			getLowerCaseCode: function() {
				return get('toLowerCaseCode');
			},
			setCapitalPop: function(newCapitalPop) {
				put('capitalPop', newCapitalPop);
			},
			getCapitalPop: function() {
				return get('capitalPop');
			},
			setNeighbors: function(newNeighbors) {
				put('neighbors', newNeighbors);
			},
			getNeighbors: function() {
				return get('neighbors');
			},
			setNeighborNum: function(newNeighborNum) {
				put('neighborNum', newNeighborNum);
			},
			getNeighborNum: function() {
				return $scope.get('neighborNum');
			}
		};
	}])
	.controller('HomeCtrl', ['$scope', '$location', function($scope, $location) {

		$scope.viewCountries = function() {
			$location.path('/countries');
		};
	}])
	.controller('CountriesCtrl', ['$scope', '$http', '$location', 'currentCountry', function($scope, $http, $location, currentCountry) {

		//Get countries list from 'countryInfo' endpoint
		$http({
			crossDomain: true,
			xhrFields: {withCredentials: false},
			url: 'https://api.geonames.org/countryInfoJSON?username=carliecope/',
			method: 'JSONP',
			cache: true
			}).then(function(response) {

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
			currentCountry.setLowerCaseCode(code.toLowerCase());

			$location.path('/countries/' + country + '/' + capital);
		}; 
		$scope.toHome = function() {
			$location.path('/');
		};
	}])
	.controller('CountryCtrl', ['$scope', '$http', '$routeParams', '$location', 'currentCountry', function($scope, $http, $routeParams, $location, currentCountry) {

		$scope.country = currentCountry.getCountry();

		$scope.capital = currentCountry.getCapital();

		$scope.ctryPop = currentCountry.getCtryPop();

		$scope.ctryArea = currentCountry.getCtryArea();

		$scope.geonameId = currentCountry.getGeonameId();

		$scope.codeUpperCase = currentCountry.getCode();
		
		$scope.codeLowerCase = currentCountry.getLowerCaseCode();

		//Get capital population from 'search' endpoint
		var requestSearch = {
			name_equals: $scope.capital,
			isNameRequired: true
		};

		$http({
			crossDomain: true,
			xhrFields: {withCredentials: false},
			url: 'https://api.geonames.org/searchJSON?q=' + $scope.capital + '&featureCode=PPLC&maxRows=10&username=carliecope/',
			method: 'GET',
			cache: true,
			params: requestSearch,
			}).then(function(response) {

				if(response.data.geonames.length !== 0) {
					$scope.capitalPop = response.data.geonames[0].population;
					currentCountry.setCapitalPop($scope.capitalPop);

				} else {
					$scope.capitalPop = "NA";
					currentCountry.setCapitalPop($scope.capitalPop);
				}
				
			}, function(response) {
				console.log('error');

			});

		//Get neighbors from 'neighbors' endpoint 
		var requestNeighbors = {
			geonameId: $scope.geonameId
		};
		
		$http({
			crossDomain: true,
			xhrFields: {withCredentials: false},
			url: 'https://api.geonames.org/neighboursJSON?geonameId=' + $scope.geonameId + '&username=carliecope/',
			method: 'GET',
			cache: true,
			params: requestNeighbors,
		}).then(function(response) {
			
			$scope.neighborNum = response.data.geonames.length;
			currentCountry.setNeighborNum($scope.neighborNum); 

			var neighbors = [];

			for(i=0; i < $scope.neighborNum; i++) {
				neighbors.push(response.data.geonames[i].countryName);
				$scope.neighbors = neighbors.join(', ');
				currentCountry.setNeighbors($scope.neighbors); 
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





