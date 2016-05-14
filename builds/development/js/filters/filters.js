CountriesCapitals.filter('capitalize', function() {
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
  });