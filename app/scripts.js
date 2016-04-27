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
         getData: function(capital) {
           return $http.get('http://api.geonames.org/searchJSON?name_equals=' + capital + '&maxRows=10&username=pixl_pshr', { cache: true }).then(function(result) {
               return result.data;
           });
         }
       }
    })
    .factory('neighborRequest', function($http) {
       return {
         getData: function(countryCode) {
           return $http.get('http://api.geonames.org/neighboursJSON?country=' + countryCode + '&username=pixl_pshr', { cache: true }).then(function(result) {
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
            console.log('data: ' + countryData[0]);
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

       	capitalRequest.getData($routeParams).then(function(data) {
           var parsedData = angular.fromJson(data);
           $scope.capitalData = parsedData.geonames;
           console.log($scope.capitalData);
       	});
       	
       	neighborRequest.getData($routeParams).then(function(data) {
           var parsedData = angular.fromJson(data);
           $scope.neighborRequestData = parsedData.geonames;
       	});

    }]);
