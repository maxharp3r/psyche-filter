
function SurveyCtrl($scope, $http) {

  $scope.submitSurvey = function() {
    console.log("process survey", $scope.survey);

    $http.post("surveys/new", $scope.survey)
    .success(function(data, status, headers, config) {
        console.log("SUCCESS");
        $scope.data = data;
    }).error(function(data, status, headers, config) {
        $scope.status = status;
        console.log("ERROR");
    });

  }
}
