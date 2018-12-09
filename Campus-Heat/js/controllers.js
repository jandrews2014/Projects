angular.module('SvgMapApp', [])
    .controller('MainCtrl', ['$scope', function ($scope) {
        var levels = ["L1", "L2", "L3", "L4","L5"];
        $scope.createDummyData = function () {
            var dataTemp = {};
            angular.forEach(levels, function (level, key) {
                dataTemp[level] = {value: Math.random()}
            });
            $scope.dummyData = dataTemp;
        };
        $scope.title = 'Campus Heat';
        $scope.createDummyData();

        $scope.changeHoverRegion = function (region) {
            $scope.hoverRegion = region;
        };
    }]);