var CountriesCapitals = angular.module("root", ['ngAnimate', 'ngRoute'])
	.constant('GEO_NAMES_USER_NAME', 'pixl_pshr')
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            template : '<p>Welcome to Countries & Capitals</p>',
            controller : 'indexCtrl'
        }).when('/countries', {
          templateUrl : 'countries.html',
          controller: 'listCtrl'
        }).when('/countryDetails', {
          templateUrl : 'countryDetails.html',
          controller: 'detailsCtrl'
        })
        .otherwise('/indexCtrl');
    }])
    .factory('allCountriesRequest', function($http) {
       return {
         getData: function() {
           return $http.get('http://api.geonames.org/countryInfoJSON?username=pixl_pshr').then(function(result) {
               return result.data;
           });
         }
       }
    })
	.controller('indexCtrl', function($scope) {
		// empty for now
	})
    .controller('listCtrl', ['$scope', 'allCountriesRequest', function ($scope, allCountriesRequest) {

        $scope.countries = [];

       allCountriesRequest.getData().then(function(data) {
           // $scope.countries = data;
           var parsedData = angular.fromJson(data);
           $scope.countries = parsedData.geonames;
           console.log(parsedData);

           // for (var i = 0; i < $scope.countries.length; i++) {
           //  var 
           // }
       });
	}])
	.controller('detailsCtrl', function($scope) {
		// empty for now
	});
