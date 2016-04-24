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
    .factory('countryService', ['$resource', function($resource) {
      return $resource('/api/food/:id', {id: '@id'}, {
        markAsRemoved: {
          url: '/api/food/:id/remove',
          method: 'POST',
          isArray: true
        }
      });
    }])
	.controller('indexCtrl', function($scope) {
		// empty for now
	})
    .controller('listCtrl', ['$scope', 'allCountriesRequest', '$routeParams', function ($scope, allCountriesRequest, $routeParams) {

        $scope.params = $routeParams;
        $scope.countries = [];

       allCountriesRequest.getData().then(function(data) {
           var parsedData = angular.fromJson(data);
           $scope.countries = parsedData.geonames;
       });
	}])
    .controller('detailsCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

        $scope.params = $routeParams;

    }]);
