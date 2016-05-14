var CountriesCapitals = angular.module("root", ['ui.bootstrap', 'ngTouch', 'ngAnimate', 'ngRoute'])
	.constant('GEO_NAMES_USER_NAME', 'pixl_pshr')
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/', {
            template : "<p>Pocket Atlas is an Angular App that displays data from GeoNames.org. <br>Built as an Angular learning project by Chuck McQuilkin.</p><a class='cc-btn' href='#/countries'>Explore</a>",
            controller : 'indexCtrl'
        }).when('/countries', {
          templateUrl : 'views/countries.html',
          controller: 'listCtrl'
        }).when('/countries/:countryId', {
          templateUrl : 'views/countryDetails.html',
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
	.controller('indexCtrl', function($scope) {
		// empty for now
	});