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
    .factory('allCountriesRequest', ['$http', '$q', function ($http, $q, GEO_NAMES_USER_NAME) {
    	return {
    		getAllItems : function (country) {
    			// deferred object
    			var deferred = $q.defer();
    			var apiUrl = 'http://api.geonames.org/countryInfoJSON?username=' + GEO_NAMES_USER_NAME;
    			
    			$http.defaults.useXDomain = true;
    			delete $http.defaults.headers.common['X-Requested-With'];
    			console.log('hi');
    			
    			// Calling Web API
    			$http.get(apiUrl).success(function (data) {
    				// Passing data to deferred's resolve function on successful completion
    				deferred.resolve(data);
    			}).error(function (error) {
    				// Sending a friendly error message in case of failure
    				deferred.reject('An error occurred while fetching items.');
    			});
    			// Returning the promise object
    			return deferred.promise;
    		}
    	}
    }])
	.controller('indexCtrl', function($scope) {
		// empty for now
	})
    .controller('listCtrl', ['$scope', 'allCountriesRequest', function ($scope, allCountriesRequest) {
        $scope.countries = [];
        $scope.items = [];

        allCountriesRequest.getAllItems($scope.country).then(function (data) {
            var parsedData = angular.fromJson(data);
            $scope.items = parsedData.geonames;
            alert(data.message);

			// loop through geonames data
            for (var i = 0; i < $scope.items.length; i++) {
                var country = $scope.items[i];
                $scope.countries.push({ /* write code here to parse each country */ });
            }
        },
        function (errorMessage) {
            $scope.error = errorMessage;
        });
	}])
	.controller('detailsCtrl', function($scope) {
		// empty for now
	});
