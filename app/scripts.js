var CountriesCapitals = angular.module("root", ['ngAnimate', 'ngRoute'])
	.constant('GEO_NAMES_USER_NAME', 'pixl_pshr')
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            template : '<p>Welcome to Countries & Capitals</p>',
            controller : 'indexCtrl'
        }).when('/countries', {
          templateUrl : 'countries.html',
          controller: 'listCtrl'
        }).when('/countries/:countryId', {
          templateUrl : 'countryDetails.html',
          controller: 'detailsCtrl'
        })
        .otherwise('/indexCtrl');
    }])
    .factory('allCountriesRequest', function($http) {
       return {
         getData: function() {
           return $http.get('http://api.geonames.org/countryInfoJSON?username=pixl_pshr', { cache: true }).then(function(result) {
               return result.data;
           });
         }
       }
    })
    .factory('capitalRequest', function($http) {
       return {
         getData: function(countryName) {
           return $http.get('http://api.geonames.org/searchJSON?name_equals=' + countryName + '&maxRows=10&username=pixl_pshr', { cache: true }).then(function(result) {
               return result.data;
           });
         }
       }
    })
    .factory('neighborRequest', function($http) {
       return {
         getData: function(countryCode) {
           return $http.get('http://api.geonames.org/neighboursJSON?country=' + countryCode + '&maxRows=10&username=pixl_pshr', { cache: true }).then(function(result) {
               return result.data;
           });
         }
       }
    })
	.service('countryService', function() {
        var countryData = [];
        return {
          saveData: function(data) {
            countryData.push(data);
          },
          getData: function() {
            return countryData;
          }
        };
    })
    .filter('capitalize', function() {
      return function(input, scope) {
        if (input!=null)
        input = input.toLowerCase();
        return input.substring(0,1).toUpperCase()+input.substring(1);
      }
    })
	.controller('indexCtrl', function($scope) {
		// empty for now
	})
    .controller('listCtrl', ['$scope', '$window', 'allCountriesRequest', '$routeParams', 'countryService', function ($scope, $window, allCountriesRequest, $routeParams, countryService) {

        $scope.params = $routeParams;
        $scope.countries = [];

        $scope.displayCountry = function() {
            var selectedCountry = this.country; // selected country object
            var selectedCountryName = '' + selectedCountry.countryName;
            
            countryService.saveData({ 'countryCode' : selectedCountry.countryCode, 'countryName' : selectedCountry.countryName, 'population' : selectedCountry.population, 'areaInSqKm' : selectedCountry.areaInSqKm, 'capital' : selectedCountry.capital });

            $window.location.assign('#/countries/' + selectedCountryName);

        };

       allCountriesRequest.getData().then(function(data) {
           var parsedData = angular.fromJson(data);
           $scope.countries = parsedData.geonames;
       });
	}])
    .controller('detailsCtrl', ['$scope', '$routeParams', 'countryService', 'capitalRequest', 'neighborRequest', function ($scope, $routeParams, countryService, capitalRequest, neighborRequest) {

        $scope.params = $routeParams;
        $scope.countryData = countryService.getData();
        $scope.capitalData = [];
        $scope.neighborRequestData = [];
        var countryName = $scope.countryData.countryId; // how can I get the selected country Id?
        var countryCode = $scope.countryData.countryCode; // how can I get the selected country code?
        
        var log = [];
		angular.forEach($scope.counryData, function(value, key) {
			this.push(key + ': ' + value);
		}, log);
		console.log(log);
//        	capitalRequest.getData(countryName).then(function(data) {
//            var parsedData = angular.fromJson(data);
//            $scope.capitalData = parsedData.geonames;
//        	});
       	
//        	neighborRequest.getData($routeParams).then(function(data) {
//            var parsedData = angular.fromJson(data);
//            $scope.neighborRequestData = parsedData.geonames;
//        	});

    }]);
