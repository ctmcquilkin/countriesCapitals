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
            
            countryService.saveData({ 'countryName' : selectedCountry.countryName, 'population' : selectedCountry.population, 'areaInSqKm' : selectedCountry.areaInSqKm, 'captial' : selectedCountry.captial });

            console.log(selectedCountryName);

            $window.location.assign('#/countries/' + selectedCountryName);

        };

       allCountriesRequest.getData().then(function(data) {
           var parsedData = angular.fromJson(data);
           $scope.countries = parsedData.geonames;
       });
	}])
    .controller('detailsCtrl', ['$scope', '$routeParams', 'countryService', function ($scope, $routeParams, countryService) {

        $scope.params = $routeParams;
        $scope.countryData = countryService.getData();

    }]);
