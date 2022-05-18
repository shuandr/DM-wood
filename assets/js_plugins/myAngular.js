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

    $http.get("assets/data/main.json").then(function(response) {
        $scope.data = response.data;
        $scope.selectedImg = urlQuery.object ? Number(urlQuery.object) : 1;
        if (urlQuery.category) {
            for (var i = $scope.data.works.length - 1; i >= 0; i--) {
                if (urlQuery.category == $scope.data.works[i].name) {
                    $scope.selectedCat = $scope.data.works[i];
                    $scope.menuCatSel = i;
                    break;
                }
            }
        } else {
            $scope.selectedCat = $scope.data.works[0];
            $scope.menuCatSel = 0;
        }
        // console.log($scope.selectedCat.name);

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

        $scope.slickLoaded = true;
        $scope.gallerySlickConfig = {
            event: {
                init: function(event, slick) {
                   /* $scope.slickLoaded = false;
                    $timeout(function() {
                        $scope.slickLoaded = true;
                    }, 5);*/
                    slick.slickGoTo($scope.selectedImg); // slide to correct index when init
                },
                /*afterChange: function(event, slick, currentSlide) {
                    console.log(currentSlide);

                },*/
                beforeChange: function(event, slick, currentSlide, nextSlide) {
                    $scope.selectedImg = nextSlide; // save current index each time
                    $location.search({ category: $scope.selectedCat.name, object: nextSlide });
                }
            }
        }
    });

    $scope.selectCat = function(cat) {
        $scope.selectedCat = $scope.data.works[cat];
        $scope.menuCatSel = cat;
        $location.search({ category: $scope.selectedCat.name });

    }


    $scope.selectImg = function(index) {
        $scope.selectedImg = index;
        $location.search({ category: $scope.selectedCat.name, object: index });
    }


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
    }

    $scope.selectVariant = function(index) {
        $scope.selectedVariant = index + 1;
    }

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