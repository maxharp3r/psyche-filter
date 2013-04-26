
function EntryCtrl($scope, $http, $location, $anchorScroll) {

    $scope.status = {};

    $scope.submitName = function() {
        console.log("submit name", $scope.entry);

        $http({
            url: CONFIG.server_addr + "/cube/start",
            method: "POST",
            data: $scope.entry
        }).success(function(data, status, headers, config) {
            $scope.data = data;

            if (data["success"]) {
                // good, start the show
            } else {
                // bad, show a message
                $scope.status.badname = true;
                setTimeout(function() {
                    $scope.entry = {};
                    $scope.status.badname = false;
                    $scope.$apply();
                }, 2000);
            }


        }).error(function(data, status, headers, config) {
            $scope.status = status;
        });
    }

    var socket = io.connect(CONFIG.server_addr);

    socket.on('EVENT:start', function () {
        console.log("on EVENT:start");
    });
}

