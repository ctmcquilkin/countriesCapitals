CountriesCapitals.factory('sortable', ['$filter', '$rootScope', function($filter, $rootScope){

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
//      console.log(scope.filteredItems);

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

  }]);