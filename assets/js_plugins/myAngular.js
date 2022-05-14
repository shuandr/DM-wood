var app = angular.module('DMwood', ['ngRoute', 'ngAnimate', 'ngSanitize', 'slickCarousel']);

app.config(['$compileProvider', "$routeProvider", "$interpolateProvider", "$locationProvider",

    function($compileProvider, $routeProvider, $interpolateProvider, $locationProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
        $locationProvider.hashPrefix('');
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|viber|tel|mailto|chrome-extension):/);
        $routeProvider
            .when('/main', {
                templateUrl: 'main.html'
            })
            .when('/gallery', {
                templateUrl: 'gallery.html'
            })
            .when('/dmdoors', {
                templateUrl: 'dmdoors.html'
            })
            .when('/door', {
                templateUrl: 'door.html'
            })
            .otherwise({
                redirectTo: '/main'
            });
    }
]);

app.controller('DMwoodCtrl', function($scope, $http, $route, $routeParams, $location, $timeout) {

    var urlQuery = $location.search();

    $scope.getCategory = function() {
        for (var i = $scope.data.works.length - 1; i >= 0; i--) {
            if (urlQuery.category == $scope.data.works[i].name) {
                return i;
            }
        }
    };

    $http.get("assets/data/main.json").then(function(response) {
        $scope.data = response.data;
        $scope.selectedCat = urlQuery.category ? $scope.data.works[$scope.getCategory()] :
            $scope.data.works[0];
        $scope.selectedImg = urlQuery.object ? Number(urlQuery.object) : 1;

        $scope.mainSlickConfig = {
            arrows: false,
            autoplay: true,
            pauseOnHover: false,
            autoplaySpeed: 2400,
            speed: 1200,
            fade: true
        };
        $scope.objSlickConfig = {
            centerMode: true,
            variableWidth: true,
            arrows: false,
            autoplay: true,
            pauseOnHover: false,
            speed: 800,
            autoplaySpeed: 2400
        };
        $scope.gallerySlickConfig = {
            initialSlide: $scope.selectedImg
        };
    });

    $scope.selectCat = function(cat) {
        $scope.selectedCat = $scope.data.works[cat];
        $location.search({ category: $scope.selectedCat.name });

    };
    $scope.selectImg = function(image) {
        $scope.selectedImg = image;
        $location.search({ object: image });
        console.log(Number($scope.selectedImg) + 1);
    };
    // ————————————————
    // DOORS

    $http.get("assets/data/doors.json").then(function(response) {
        $scope.doorsData = response.data;
        $scope.selectedModel = urlQuery.model ? Number(urlQuery.model) : 0;

        $scope.selectedVariant = 1;
        $scope.setPrevNextModels($scope.selectedModel);
    });


    $scope.selectModel = function(index) {
        $scope.selectedModel = index;
        $location.search({ model: $scope.selectedModel });
        $scope.selectVariant(0);
    };

    $scope.selectVariant = function(index) {
        $scope.selectedVariant = index + 1;
    };

    $scope.setPrevNextModels = function(index) {
        let i = index;
        const cat = $scope.doorsData.catalogue;
        const model = $scope.selectedModel;

        $scope.prevModelName = (model !== 0) ?
            cat[--i].name : cat[cat.length - 1].name;
        $scope.nextModelName = (model < cat.length - 1) ?
            cat[i + 2].name : cat[0].name;

    };

    $scope.prevModel = function() {
        if ($scope.selectedModel !== 0) {
            $scope.selectedModel--;
        } else {
            $scope.selectedModel = $scope.doorsData.catalogue.length - 1;
        };
        $scope.setPrevNextModels($scope.selectedModel);
        $location.search({ model: $scope.selectedModel });


    };
    $scope.nextModel = function() {
        if ($scope.selectedModel < $scope.doorsData.catalogue.length - 1) {
            $scope.selectedModel++;
        } else {
            $scope.selectedModel = 0;
        };
        $scope.setPrevNextModels($scope.selectedModel);
        $location.search({ model: $scope.selectedModel });


    };


    $scope.key = function($event) {
        if ($event.keyCode == 37) { // left arrow
            $scope.prevModel();

        } else if ($event.keyCode == 39) { // right arrow
            $scope.nextModel();
        }
    }

});