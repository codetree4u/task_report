var myApp = angular.module('myApp', ['smart-table', 'ui.bootstrap']);
myApp.controller('mainCtrl', ['$scope', '$http', '$filter', function($scope, $http) {
    console.log("controller loging to Client #1");

    var refresh = function() 
{
    $http.get('/POSPAY').success(function(response) {
//  console.log("Client requesting controller.js myApp module");
   
 //  $scope.listfromdb = response;
    $scope.rows = "";
    $scope.names = ["Becca", "Lerma", "Sonia", "Other"];
 //   $scope.status = ["Closed","Inprogress", "Open"];
    $scope.resolution = ["Completed","In Progress","No File","Holiday"];
 //   $scope.status = response[COMMENTS.isDone];
    $scope.displayed=[]
    $scope.displayed= response;
    $scope.displayedCollection = [].concat($scope.displayed);
// console.log(response);
     });
};



refresh();
  ////////////////////////////////////////////


//f(2)
$scope.edit = function(id) {
    console.log(id);
    $http.get('/POSPAY/' + id).success(function(response) {
      $scope.rows = response;
      
    });
  };  
//f(3)  
  $scope.update = function() {
    console.log($scope.rows._id);
    console.log($scope.rows);
    console.log("hello carlos from controller2");
    $http.put('/POSPAY/' + $scope.rows._id, $scope.rows).success(function(response) {
      refresh();
    })
  };
  
  $scope.deselect = function() {
    console.log("deselect controller loging to Client #1");
        $scope.rows = "";
  }


}])
///////////////////////////////////////////////////////////////////////////
////////////////////////////myApp.directive('stDateRange'//////////////////
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
////////////////////////////myApp.directive('stDateRange'//////////////////
///////////////////////////////////////////////////////////////////////////
.directive('stDateRange', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        require: '^stTable',
        scope: {
            before: '=',
            after: '='
        },
        templateUrl: 'html/stDateRange.html',
  
        link: function (scope, element, attr, table) {
  
            var inputs = element.find('input');
            var inputBefore = angular.element(inputs[0]);
            var inputAfter = angular.element(inputs[1]);
            var predicateName = attr.predicate;
  
  
            [inputBefore, inputAfter].forEach(function (input) {
  
                input.bind('blur', function () {
  
  
                    var query = {};
  
                    if (!scope.isBeforeOpen && !scope.isAfterOpen) {
  
                        if (scope.before) {
                            query.before = scope.before;
                        }
  
                        if (scope.after) {
                            query.after = scope.after;
                        }
  
                        scope.$apply(function () {
                            table.search(query, predicateName);
                        })
                    }
                });
            });
  
            function open(before) {
                return function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
  
                    if (before) {
                        scope.isBeforeOpen = true;
                    } else {
                        scope.isAfterOpen = true;
                    }
                }
            }
  
            scope.openBefore = open(true);
            scope.openAfter = open();
        }
    }
  }])
  ///////////////////////////////////////////////////////////////////////////
  /////////////////////////directive('stNumberRange /////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  myApp.directive('stNumberRange', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        require: '^stTable',
        scope: {
            lower: '=',
            higher: '='
        },
        templateUrl: 'html/stNumberRange.html',
        link: function (scope, element, attr, table) {
            var inputs = element.find('input');
            var inputLower = angular.element(inputs[0]);
            var inputHigher = angular.element(inputs[1]);
            var predicateName = attr.predicate;
  
            [inputLower, inputHigher].forEach(function (input, index) {
  
                input.bind('blur', function () {
                    var query = {};
  
                    if (scope.lower) {
                        query.lower = scope.lower;
                    }
  
                    if (scope.higher) {
                        query.higher = scope.higher;
                    }
  
                    scope.$apply(function () {
                        table.search(query, predicateName)
                    });
                });
            });
        }
    };
  }])
  //////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////////filter/////////////////////////////////////
  ////////////////////////////////filter/////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  .filter('customFilter', ['$filter', function ($filter) {
  
  console.log("controller loging to Client #1 filter"); 
  
    var filterFilter = $filter('filter');
    var standardComparator = function standardComparator(obj, text) {
        text = ('' + text).toLowerCase();
        return ('' + obj).toLowerCase().indexOf(text) > -1;
    };
  
    return function customFilter(array, expression) {
        function customComparator(actual, expected) {
  
            var isBeforeActivated = expected.before;
            var isAfterActivated = expected.after;
            var isLower = expected.lower;
            var isHigher = expected.higher;
            var higherLimit;
            var lowerLimit;
            var itemDate;
            var queryDate;
  
     console.log(isBeforeActivated); 
   //  console.log(actual, expected); 
  
            if (angular.isObject(expected)) {
              console.log("controller isBeforeActivated"); 
                //date range
                if (expected.before || expected.after) {
                  
                        try {
                        if (isBeforeActivated) {
                            higherLimit = expected.before;
  
                            itemDate = new Date(actual);
                            queryDate = new Date(higherLimit);
  
                            if (itemDate > queryDate) {
                                return false;
                            }
                        }
  
                        if (isAfterActivated) {
                            lowerLimit = expected.after;
  
                            
                            itemDate = new Date(actual);
                            queryDate = new Date(lowerLimit);
  
                            if (itemDate < queryDate) {
                                return false;
                            }
                        }
  
                        return true;
                    } catch (e) {
                        return false;
                    }
             
                } else if (isLower || isHigher) {
                    //number range
                    if (isLower) {
                        higherLimit = expected.lower;
  
                        if (actual > higherLimit) {
                            return false;
                        }
                    }
  
                    if (isHigher) {
                        lowerLimit = expected.higher;
                        if (actual < lowerLimit) {
                            return false;
                        }
                    }
  
                    return true;
                }
                //etc
  
                return true;
  
            }
            return standardComparator(actual, expected);
        }
  
        var output = filterFilter(array, expression, customComparator);
        return output;
    };
  }])
  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////////stExport/////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  myApp.directive('stExport',function(){
      return {
          require:'^stTable',
          link:function(scope, element, attr,ctrl){
          element.bind('click',function(){
          alert(ctrl.getFilteredCollection().length);
    
      })
    }
    }
    
    });
