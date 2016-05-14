CountriesCapitals.factory('allCountriesRequest', function($http) {
       return {
         getData: function() {
           return $http.get('http://api.geonames.org/countryInfoJSON?username=pixl_pshr', { cache: true }).then(function(result) {
               return result.data;
           });
         }
       }
    });