angular.module('DataServices', [])
	
	.factory('dataFactory', ['$http', '$q', '$route', function($http, $q, $route) {
		
		//User name for geonames api
		var username = "carliecope";

		var baseURL = "http://api.geonames.org/";

		return {

			//Get countries list call

			getCountries: function() {
				var defer = $q.defer();
				var url = baseURL + "countryInfoJSON";
				var request = { 
					callback: 'JSON_CALLBACK',
					username: username
				};

				$http({
					method: 'JSONP',
					url: url,
					params: request,
					cache: true
				})
				.success(function(data, status, headers, config) {
			        if(typeof data.status == 'object') {
			          console.log("Error'" + data.status.message + ".");
			          defer.reject(data.status);
			        } else {
			          defer.resolve(data);
			        }
				})
				.error(function(data, status, headers, config) {
	        		console.log(status + " error occurred.");
	        		defer.reject();
				});

				return defer.promise;
		    },

			 //Get capital population from 'search endpoint'

		    getCapitals: function(countryCode) {
		    	var defer = $q.defer();
		    	var url = baseURL + 'searchJSON?';
		    	var request = {
		    		callback: 'JSON_CALLBACK',
		    		q: "capital",
		    		formatted: true,
		    		country: countryCode,
		    		maxRows: 1,
    				username: username
		    	};

			    $http({
			    	method: 'JSONP',
			    	url: url,
			    	params: request,
			    	cache: true
			    })
			    .success(function(data, status, headers, config) {
			    	defer.resolve(data.geonames[0]);

			    })
			    .error(function(data, status, headers, config) {
	        		console.log(status + " error occurred.");
	        		defer.reject();
				});

			    return defer.promise;
			},

			//Get neighbors from 'neightbors' endpoint
			getNeighbors: function(countryCode) {
				var defer = $q.defer();
				var url = baseURL + 'neighboursJSON';
				var request = {
			        callback: 'JSON_CALLBACK',
			        country: countryCode,
			        username: username
				};

				$http({
					method: 'JSONP',
					url: url,
					params: request,
					cache: true
				})
				.success(function(data, status, headers, config) {
			    	defer.resolve(data);

			    })
			    .error(function(data, status, headers, config) {
	        		console.log(status + " error occurred.");
	        		defer.reject();
				});

			    return defer.promise;
			}, 
			//function to make request for info on a country
		    getCountry: function(countryCode) {
				var defer = $q.defer();
				var url = baseURL + "countryInfoJSON";
				var request = {
					callback: 'JSON_CALLBACK',
					country: countryCode,
					username: username
				};

				$http({
					method: 'JSONP',
					url: url,
					params: request,
					cache: true
				})
				.success(function(data, status, headers, config) {
				defer.resolve(data.geonames);
				})
				.error(function(data, status, headers, config) {
				console.log(status + " error occured.");
				defer.reject();
				});

				return defer.promise;
			}
		};
	}]);



