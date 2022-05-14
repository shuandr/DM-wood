var app = angular.module('DmDoors', []);



app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{');
    $interpolateProvider.endSymbol('}]}');
});




app.controller('DmDoorsCtrl', function($scope, $http) {

    $scope.selectedModel = "шотатам";
    $scope.selectedImg = "1";
    $scope.selectModel = function(index) {
        $scope.selectedModel = index;
        $scope.selectedImg = 1;
    };
$scope.selectImg = function(index) {
        $scope.selectedImg = index+1;
    };



    $http.get("assets/data/doors.json").then(function(response) {
        $scope.data = response.data;

    });

    $scope.nextImg = function() {
        if ($scope.selectedModel < $scope.data.catalogue.length - 1) {
           $scope.selectedModel++;

        } else {
            $scope.selectedModel = 0;
        };
    };

    $scope.prevImg = function() {
        if ($scope.selectedModel !== 0) {
           $scope.selectedModel--;

        } else {
            $scope.selectedModel = $scope.data.catalogue.length-1;
        };
    };

    $scope.key = function($event){
        if ($event.keyCode == 37){ // left arrow
            $scope.prevImg();  

        }
        else if ($event.keyCode == 39) {// right arrow
            $scope.nextImg();
        }
    }
});