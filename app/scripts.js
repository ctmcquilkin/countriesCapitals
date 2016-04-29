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
	.factory('countryRequest',function($q,$http){
  
	  return function(files){
	
		var promises = [];
	
		angular.forEach(files, function(file){
	  
		  var deffered  = $q.defer();
  
		  $http({
			url : file,
			method: 'GET'
		  }).
		  success(function(data){
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
// 	.factory('countryRequest', function ($http, $q){
// 		var _getCountryData = function (countryCode){
// 		  //$q.all will wait for an array of promises to resolve,
// 		  // then will resolve it's own promise (which it returns)
// 		  // with an array of results in the same order.
// 		  var _countryCode = countryCode;
// 		  return $q.all([
// 			$http.get('http://api.geonames.org/searchJSON?country=' + _countryCode + '&maxRows=10&username=pixl_pshr'),
// 			  $http.get('http://api.geonames.org/neighboursJSON?country=' + _countryCode + '&maxRows=10&username=pixl_pshr')
// 		  ])
// 		
// 		  //process all of the results from the two promises 
// 		  // above, and join them together into a single result.
// 		  // since then() returns a promise that resolves to the
// 		  // return value of it's callback, this is all we need 
// 		  // to return from our service method.
// 		  .then(function(results) {
// 			var data = [];
// 			angular.forEach(results, function(result) {
// 			  data = data.concat(result.data);
// 			});
// 			console.log(data[0]); // Capital Population Blob
// // 			countryService.saveData(data);
// 			console.log(data[1]); // Neighbors
// 			return data;
// 		  });
// 		};
// 	  return {
// 		getCountryData: _getCountryData
// 	  };
// 	})
	.factory('theService', function() {  
		return {
			thing : {
				x : 100
			}
		};
	})
	.provider('helloWorld', function() {

		this.name = 'Default';

		this.$get = function() {
			var name = this.name;
			return {
				sayHello: function() {
					return "Hello, " + name + "!"
				}
			}
		};

		this.setName = function(name) {
			this.name = name;
		};
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
    .controller('listCtrl', ['$scope', '$window', 'allCountriesRequest', '$routeParams', 'countryService', 'countryRequest', 'theService', function ($scope, $window, allCountriesRequest, $routeParams, countryService, countryRequest, theService) {

        $scope.params = $routeParams;
        $scope.countries = [];

		$scope.thing = theService.thing;
		$scope.name = "First Controller";

        $scope.displayCountry = function() {
            var selectedCountry = this.country; // selected country object
            var selectedCountryName = '' + selectedCountry.countryName;
            var selectedCountryCode = '' + selectedCountry.countryCode;
            
            countryService.saveData({ 'countryCode' : selectedCountry.countryCode, 'countryName' : selectedCountry.countryName, 'population' : selectedCountry.population, 'areaInSqKm' : selectedCountry.areaInSqKm, 'capital' : selectedCountry.capital });

            $window.location.assign('#/countries/' + selectedCountryName);
//             countryRequest.getCountryData(selectedCountryCode);

        };

       allCountriesRequest.getData().then(function(data) {
           var parsedData = angular.fromJson(data);
           $scope.countries = parsedData.geonames;
       });
	}])
    .controller('detailsCtrl', ['$scope', '$routeParams', 'countryService', 'countryRequest', 'theService', function ($scope, $routeParams, countryService, countryRequest, theService) {

        $scope.params = $routeParams;
        $scope.countryData = countryService.getData();
        var countryCode = 'AF';

		$scope.someThing = theService.thing; 
		$scope.name = "Second Controller!";
        
		countryRequest(['http://api.geonames.org/searchJSON?country=' + countryCode + '&maxRows=10&username=pixl_pshr', 'http://api.geonames.org/neighboursJSON?country=' + countryCode + '&maxRows=10&username=pixl_pshr']).then(function(datas){
			$scope.capitalData = datas[0]
			$scope.NeighbourData = datas[1].geonames
		})

    }]);
