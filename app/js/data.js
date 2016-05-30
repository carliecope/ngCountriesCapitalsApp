//Make data object accessible for all pages of app 

angular.module('Data', [])

.factory('countryData', ['dataFactory', function(dataFactory) {
  var countryData = {};

  countryData.countries = dataFactory.getCountries();
  countryData.getCountry = dataFactory.getCountry;
  countryData.getCapitals = dataFactory.getCapitals;
  countryData.getNeighbors = dataFactory.getNeighbors;
  return countryData;
}]);