
function scrollToAnchor(aid) {
    // var aTag = $("a[name='"+ aid +"']");
    // $('html,body').animate({scrollTop: $('#' + aid).offset().top}, 'fast');

    var y = $('#' + aid).offset().top;
    $('body').scrollTop(y);
}

function IntakeCtrl($scope, $http, $location, $anchorScroll) {

    $scope.scrollTo = function(id) {
        scrollToAnchor(id);
        // this is the native angular way to scroll
        // $location.hash(id);
        // $anchorScroll();
    }

    $scope.submitSurvey = function() {
        console.log("process survey", $scope.survey);
    }
}

