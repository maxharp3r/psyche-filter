
function EntryCtrl($scope, $http, $location, $anchorScroll) {

    $scope.status = {};

    $scope.submitName = function() {
        console.log("submit name", $scope.entry);

        $http({
            url: CONFIG.wireless_addr + "/cube/start",
            method: "POST",
            data: $scope.entry
        }).success(function(data, status, headers, config) {
            $scope.data = data;

            if (data["success"]) {
                // good, socket.io will start the show (see EVENT:begin)
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

    var socket = io.connect(CONFIG.wireless_addr);

    socket.on('EVENT:begin', function () {
        console.log("on EVENT:begin");
        $scope.entry = {};
        $scope.status.started = true;
        $scope.$apply();
    });

    socket.on('EVENT:end', function () {
        console.log("on EVENT:end");
        $scope.status.started = false;
        $scope.$apply();
    });

    socket.on('CMD:control', function (cmd) {
        console.log("on CMD:control", cmd);
        if (cmd === "reload") {
            window.location.reload(true);
        }
    });

}

