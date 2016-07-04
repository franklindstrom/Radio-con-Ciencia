// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

    .run(function ($ionicPlatform, DeviceType) {
        $ionicPlatform.ready(function () {

            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
        });

        if (ionic.Platform.isAndroid() == true) DeviceType.setDeviceType(0);
        else if (ionic.Platform.isIOS() == true) DeviceType.setDeviceType(1);
        else DeviceType.setDeviceType(2);
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('intro', {
                url: '/index',
                templateUrl: 'intro.html',
                controller: 'IntroController'
            })

            .state('main', {
                url: '/main',
                templateUrl: 'main.html',
                controller: 'MainController'
            });

        $urlRouterProvider.otherwise('/index');
    })

    .controller('IntroController', function ($scope, $state, $http, $ionicLoading, $ionicPlatform, NewsList) {
        $scope.cateId = ['ciencia', 'tecnologia', 'sociedad'];
        $scope.xmlConverterUrl = 'http://conacytprensa.mx/index.php/';

        $scope.showLoadingView = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="android" class="spinner-stable"></ion-spinner><br />Loading'
            }).then();
        };

        $scope.hideLoadingView = function () {
            $ionicLoading.hide().then();
        };

        $scope.onGetNewsList = function () {
            if ($scope.cateId.length == 0) {
                $scope.hideLoadingView();
                $state.go('main');
            } else {
                $http.get($scope.xmlConverterUrl + $scope.cateId[0], {
                    transformResponse: function (result) {
                        $scope.responseArray = result.split('<article');
                        $scope.responseArray.splice(0, 1);
                        for (var i = 0; i < 5; i++) {
                            $scope.articleData = $scope.responseArray[i].split('<');
                            $scope.articleUrl = $scope.articleData[0].split('data-permalink="')[1];
                            $scope.articleTitle = $scope.articleData[2].split('title="')[1];

                            for (var j = 3; j < $scope.articleData.length; j++) {
                                if ($scope.articleData[j].indexOf('img') > -1) {
                                    $scope.articleImage = $scope.articleData[j].split('src="')[1];
                                    var item = {
                                        title: $scope.articleTitle.substring(0, $scope.articleTitle.indexOf('">')),
                                        image: 'http://conacytprensa.mx' + $scope.articleImage.substring(0, $scope.articleImage.indexOf('"')),
                                        url: $scope.articleUrl.substring(0, $scope.articleUrl.indexOf('">'))
                                    };

                                    NewsList.addItem(item);
                                    break;
                                }
                            }
                        }
                    }
                }).then(function () {
                    if ($scope.cateId.length > 0) {
                        $scope.cateId.splice(0, 1);
                        $scope.onGetNewsList();
                    }
                });
            }
        };

        $scope.showLoadingView();
        $scope.onGetNewsList();
    })

    .controller('MainController', function ($scope, $state, $interval, $timeout, $window, NewsList, DeviceType, $ionicHistory, $ionicPlatform) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();

        $scope.newsList = NewsList.all();
        $scope.isRadioLoading = 0;
        $scope.isRadioPlaying = 0;
        $scope.isFirstPlaying = true;

        var radioTopic = document.getElementById('radio-topic');
        var newsTopic = document.getElementById('noticias_title');

        if ($window.innerWidth >= 480) {
            radioTopic.style.fontSize = '30px';
            newsTopic.style.fontSize = '25px';
        } else if ($window.innerWidth == 320) {
            radioTopic.style.fontSize = '15px';
            newsTopic.style.fontSize = '15px';
        } else {
            radioTopic.style.fontSize = '19px';
            newsTopic.style.fontSize = '19px';
        }

        var ring = document.getElementById('ring');
        var radio_loading_ring = document.getElementById('radio-loading-ring');
        var radio_loading_playButton = document.getElementById('radio-loading-playButton');
        var playButton = document.getElementById('playButton');
        var stopButton = document.getElementById('stopButton');

        var ring_angle = 0, loadingRadio_angle = 0, playButton_angle = 0;

        $scope.onRotatingRingAnimation = function () {
            $scope.onToggleButtons($scope.isRadioPlaying);
            $scope.onShowHideRadioLoading($scope.isRadioLoading);

            $interval(function () {
                if (ring_angle == -360) ring_angle = 0;

                ring_angle -= 5;

                ring.style.webkitTransform = 'rotate(' + (ring_angle) + 'deg)';
                ring.style.mozTransform = 'rotate(' + (ring_angle) + 'deg)';
                ring.style.msTransform = 'rotate(' + (ring_angle) + 'deg)';
                ring.style.oTransform = 'rotate(' + (ring_angle) + 'deg)';
                ring.style.transform = 'rotate(' + (ring_angle) + 'deg)';
            }, 50);
        };

        $scope.onRadioLoadingAnimation = function () {
            $scope.onShowHideRadioLoading($scope.isRadioLoading);

            $interval(function () {
                if (loadingRadio_angle == -360) loadingRadio_angle = 0;

                loadingRadio_angle -= 20;

                radio_loading_ring.style.webkitTransform = 'rotate(' + (loadingRadio_angle) + 'deg)';
                radio_loading_ring.style.mozTransform = 'rotate(' + (loadingRadio_angle) + 'deg)';
                radio_loading_ring.style.msTransform = 'rotate(' + (loadingRadio_angle) + 'deg)';
                radio_loading_ring.style.oTransform = 'rotate(' + (loadingRadio_angle) + 'deg)';
                radio_loading_ring.style.transform = 'rotate(' + (loadingRadio_angle) + 'deg)';

                if (playButton_angle == -360) playButton_angle = 0;

                playButton_angle += 5;

                radio_loading_playButton.style.webkitTransform = 'rotate(' + (playButton_angle) + 'deg)';
                radio_loading_playButton.style.mozTransform = 'rotate(' + (playButton_angle) + 'deg)';
                radio_loading_playButton.style.msTransform = 'rotate(' + (playButton_angle) + 'deg)';
                radio_loading_playButton.style.oTransform = 'rotate(' + (playButton_angle) + 'deg)';
                radio_loading_playButton.style.transform = 'rotate(' + (playButton_angle) + 'deg)';
            }, 50);
        };

        var radio;

        if (DeviceType.isIOSDevice() == true) radio = new Media('http://9433.live.streamtheworld.com/CONCIENCIA_SO1.mp3');
        else radio = document.getElementById('radioPlayer');

        $scope.onNewsClicked = function (index) {
            $scope.url = NewsList.getSelectedUrl(index);
            if (cordova) {
                cordova.InAppBrowser.open($scope.url, '_blank', 'location=no');
            }

        };
        $scope.onLinkWebSite = function () {
            if (cordova) {
                cordova.InAppBrowser.open('http://www.conacytprensa.mx', '_blank', 'location=no');
            }
        };

        $scope.onRadioPlay = function () {
            if ($scope.isFirstPlaying) {
                $scope.isRadioLoading = 1;
                $scope.onRadioLoadingAnimation();

                if (radio == null) alert('Radio Player is null!');

                $timeout(function () {
                    $scope.isRadioLoading = 0;
                    $scope.isRadioPlaying = 1;
                    $scope.isFirstPlaying = false;

                    $scope.onToggleButtons($scope.isRadioPlaying);
                    $scope.onShowHideRadioLoading($scope.isRadioLoading);

                    radio.play();
                }, 5000);
            } else {
                $scope.isRadioLoading = 0;
                $scope.isRadioPlaying = 1;
                $scope.isFirstPlaying = false;

                $scope.onToggleButtons($scope.isRadioPlaying);
                $scope.onShowHideRadioLoading($scope.isRadioLoading);

                radio.play();
            }
        };

        $scope.onRadioPause = function () {
            $scope.isRadioPlaying = 0;
            $scope.onToggleButtons($scope.isRadioPlaying);

            radio.pause();
        };

        $scope.onToggleButtons = function (playerStatus) {
            if (playerStatus == 1) {
                ring.style.display = 'block';
                playButton.style.display = 'none';
                stopButton.style.display = 'block';
            } else {
                ring.style.display = 'block';
                playButton.style.display = 'block';
                stopButton.style.display = 'none';
            }
        };

        $scope.onHideButtonsAndRing = function () {
            ring.style.display = 'none';
            playButton.style.display = 'none';
            stopButton.style.display = 'none';
        };

        $scope.onShowHideRadioLoading = function (loadingStatus) {
            if (loadingStatus == 0) {
                radio_loading_ring.style.display = 'none';
                radio_loading_playButton.style.display = 'none';
            } else {
                radio_loading_ring.style.display = 'block';
                radio_loading_playButton.style.display = 'block';

                $scope.onHideButtonsAndRing();
            }
        };

        $ionicPlatform.registerBackButtonAction(function () {
            if ($scope.isRadioPlaying == 0) {
                navigator.app.exitApp();
            } else {
                backAsHome.trigger();
            }
        }, 100);

        $scope.onRotatingRingAnimation();
    })

    .factory('NewsList', function () {
        var newsList = [];

        return {
            all: function () {
                return newsList;
            },
            getSelectedUrl: function (index) {
                return newsList[index].url;
            },
            addItem: function (item) {
                newsList.push(item);
            }
        };
    })

    .factory('DeviceType', function () {
        var deviceTypes = ['Android', 'iOS', 'Windows'];
        var deviceType = -1;

        return {
            setDeviceType: function (type) {
                deviceType = type;
            },

            getDeviceType: function () {
                return deviceType;
            },

            getDeviceTypes: function () {
                return deviceTypes;
            },

            isAndroidDevice: function () {
                return deviceType == 0 ? true : false;
            },

            isIOSDevice: function () {
                return deviceType == 1 ? true : false;
            },

            isWindows: function () {
                return deviceType == 2 ? true : false;
            }
        };
    });