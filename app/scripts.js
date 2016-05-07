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
    .run(function($rootScope, $location, $timeout) {
        $rootScope.$on('$routeChangeError', function() {
            $location.path("/error");
        });
        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function() {
          $timeout(function() {
            $rootScope.isLoading = false;
          }, 1000);
        });
    })
    .factory('allCountriesRequest', function($http) {
       return {
         getData: function() {
           return $http.get('http://api.geonames.org/countryInfoJSON?username=pixl_pshr', { cache: true }).then(function(result) {
               return result.data;
           });
         }
       }
    })
	.factory('countryRequest',function($q,$http){
  
	  return function(files){
	
		var promises = [];
	
		angular.forEach(files, function(file){
	  
		  var deffered  = $q.defer();
  
		  $http({
        url : file,
        method: 'GET'
		  }).success(function(data){
        deffered.resolve(data);
		  }).
		  error(function(error){
			  deffered.reject();
		  });
	  
		  promises.push(deffered.promise);

		})
	
		return $q.all(promises);
	  }
  
	})
	.factory('countryService', function() {  
    var countryData = [];
		return {
			selected: {
				countryCode : 'US' // because I need a default value
			},
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
  .filter('joinBy', function () {
        return function (input,delimiter) {
            return (input || []).join(delimiter || ',');
        };
  })
	.controller('indexCtrl', function($scope) {
		// empty for now
	})

  .controller('listCtrl', ['$scope', '$window', 'allCountriesRequest', '$routeParams', 'countryService', 'countryRequest', function ($scope, $window, allCountriesRequest, $routeParams, countryService, countryRequest) {

      $scope.params = $routeParams;

       allCountriesRequest.getData().then(function(data) {
           var parsedData = angular.fromJson(data);
           $scope.countries = parsedData.geonames;
       });

      $scope.displayCountry = function() {
          var selectedCountry = this.country; // selected country object

          countryService.selected.countryCode = selectedCountry.countryCode;
          countryService.saveData({ 'countryCode' : selectedCountry.countryCode, 'countryName' : selectedCountry.countryName, 'population' : selectedCountry.population, 'areaInSqKm' : selectedCountry.areaInSqKm, 'capital' : selectedCountry.capital });

          $window.location.assign('#/countries/' + selectedCountry.countryName);
      };
	}])
    .controller('detailsCtrl', ['$scope', '$routeParams', 'countryService', 'countryRequest', function ($scope, $routeParams, countryService, countryRequest) {

        $scope.params = $routeParams;
        $scope.countryData = countryService.getData();
        $scope.currentSelectedCountry = countryService.selected; 
        var countryCode = countryService.selected.countryCode;

        $scope.capitalFilter = function(geonames) {
          return geonames.fcodeName === "capital of a political entity";
        };

        countryRequest(['http://api.geonames.org/searchJSON?country=' + countryCode + '&maxRows=10&username=pixl_pshr', 'http://api.geonames.org/neighboursJSON?country=' + countryCode + '&maxRows=10&username=pixl_pshr']).then(function(datas){
            $scope.capitalData = datas[0].geonames;
			      $scope.NeighbourData = datas[1].geonames;
          })
    }]);