var CountriesCapitals = angular.module("root", ['ui.bootstrap', 'ngTouch', 'ngAnimate', 'ngRoute'])
	.constant('GEO_NAMES_USER_NAME', 'pixl_pshr')
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            template : "<p>Pocket Atlas is an Angular App that displays data from GeoNames.org.</p><a class='cc-btn' href='#/countries'>Explore</a>",
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
	.factory('sortable', ['$filter', '$rootScope', function($filter, $rootScope){

	  return function (scope, data, itemsPerPage, initSortingOrder) {

	
		scope.sortingOrder = initSortingOrder;
		scope.reverse = false;
		scope.filteredItems = [];
		scope.groupedItems = [];
		scope.itemsPerPage = itemsPerPage;
		scope.pagedItems = [];
		scope.currentPage = 1;
		scope.items = data;
		scope.maxSize = 5;

		  // init the filtered items
		  scope.search = function () {

			scope.filteredItems = $filter('filter')(scope.items, $rootScope.query);
// 			console.log(scope.filteredItems);

			  // take care of the sorting order
			if (scope.sortingOrder !== '') {
				scope.filteredItems = $filter('orderBy')(scope.filteredItems, scope.sortingOrder, scope.reverse);
			}

			  scope.currentPage = 1;

			  // now group by pages
			  scope.groupToPages();

			  // reset the total items for the pagination buttons
			  scope.totalItems = scope.filteredItems.length;
		  };
	  

		  // calculate page in place
		  scope.groupToPages = function () {
			  scope.pagedItems = [];
		  
			  for (var i = 0; i < scope.filteredItems.length; i++) {
				  if (i % scope.itemsPerPage === 0) {
					  scope.pagedItems[Math.floor(i / scope.itemsPerPage)] = [ scope.filteredItems[i] ];
				  } else {
					  scope.pagedItems[Math.floor(i / scope.itemsPerPage)].push(scope.filteredItems[i]);
				  }
			  }
		  };
	  

		  scope.range = function (start, end) {
			  var ret = [];
			  if (!end) {
				  end = start;
				  start = 0;
			  }
			  for (var i = start; i < end; i++) {
				  ret.push(i);
			  }
			  return ret;
		  };
	  
		  scope.showAll = function () {
			scope.itemsPerPage = scope.totalItems;
			scope.groupToPages();
		  };


		  // functions have been described process the data for display
		  scope.search();


		  // change sorting order
		  scope.sort_by = function(newSortingOrder) {
			  if (scope.sortingOrder == newSortingOrder)
				  scope.reverse = !scope.reverse;

			  scope.sortingOrder = newSortingOrder;

			  // call search again to make sort affect whole query
			  scope.search();
		  };

		  scope.sort_by(initSortingOrder);
		  scope.totalItems = scope.filteredItems.length;
	  }

	}])
  .filter('capitalize', function() {
    return function(input, scope) {
      if (input!=null)
      input = input.toLowerCase();
      return input.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase() });
    }
  })
	.filter('startFrom', function() {
		return function(input, start) {
			start = +start; //parse to int
			return input.slice(start);
		}
	})
  .filter('joinBy', function () {
        return function (input,delimiter) {
            return (input || []).join(delimiter || ',');
        };
  })
  .filter('removeUnderscore', function () {
        return function (input,delimiter) {
            return (input || []).replace(/_/g, ' ');
        };
  })
	.controller('indexCtrl', function($scope) {
		// empty for now
	})

  .controller('listCtrl', ['$rootScope', '$scope', '$window', 'allCountriesRequest', '$routeParams', 'countryService', 'countryRequest', 'sortable', '$filter', function ($rootScope, $scope, $window, allCountriesRequest, $routeParams, countryService, countryRequest, sortable, $filter) {

      $scope.params = $routeParams;

		$rootScope.query = '';
	
		$scope.gridToggleList = true;
		
// 		console.log($scope.gridToggleList);
		$scope.action = function(){
			if ($scope.gridToggleList) {
				$scope.gridToggleThumb = true;
				$scope.gridToggleList = false;
// 				console.log($scope.gridToggleList);
			} else {
				$scope.gridToggleThumb = false;
				$scope.gridToggleList = true;
// 				console.log($scope.gridToggleList);
			}

		};	

		$scope.onQueryChange = function(val){
		   $rootScope.query = val;
		   $scope.search();
		};


       allCountriesRequest.getData().then(function(data) {
           var parsedData = angular.fromJson(data);
           $scope.countries = parsedData.geonames;
           sortable($scope, $scope.countries, 6, 'countryName');
			
       });

      $scope.displayCountry = function() {
          var selectedCountry = this.country; // selected country object
          var countryNameStr = selectedCountry.countryName.replace(/\s+/g, '_')

          countryService.selected.countryCode = selectedCountry.countryCode;
          countryService.saveData({ 'countryCode' : selectedCountry.countryCode, 'countryName' : selectedCountry.countryName, 'population' : selectedCountry.population, 'areaInSqKm' : selectedCountry.areaInSqKm, 'capital' : selectedCountry.capital });

          $window.location.assign('#/countries/' + countryNameStr);
      };
	}])
    .controller('detailsCtrl', ['$scope', '$routeParams', 'countryService', 'countryRequest', function ($scope, $routeParams, countryService, countryRequest) {

        $scope.params = $routeParams;
        $scope.countryData = countryService.getData();
        $scope.currentSelectedCountry = countryService.selected; 
        $scope.currentSelectedCountryCapital = countryService.selected.capital;
        var countryCode = countryService.selected.countryCode;
        $scope.mapBg = 'http://www.geonames.org/flags/x/' + countryCode + '.png) center center no-repeat';

        $scope.capitalFilter = function(geonames) {
          return geonames.fcodeName === "capital of a political entity";
        };

        countryRequest(['http://api.geonames.org/searchJSON?country=' + countryCode + '&maxRows=10&username=pixl_pshr', 'http://api.geonames.org/neighboursJSON?country=' + countryCode + '&maxRows=10&username=pixl_pshr']).then(function(datas){
            $scope.capitalData = datas[0].geonames;
			      $scope.NeighbourData = datas[1].geonames;
          })
    }]);