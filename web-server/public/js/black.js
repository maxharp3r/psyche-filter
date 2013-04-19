
// namespace
var BLACK = {};

BLACK.DELAY_MS = 100;

BLACK.ids = ['absent-minded','accommodating','accurate','agitated','agreeable','aloof','altruistic','anti-intellectual','antisocial','anxious','argumentative','ashamed','assertive','blunt','brassy','callous','calm','carefree','careless','chaotic','cheerful','civic-minded','civil','clever','closed-minded','cocky','cold','collected','compassionate','competent','composed','confident','conforming','conscientious','conservative','considerate','controls_emotions','conventional','cool-headed','cooperative','creative','cynical','daydreamer','defiant','depressive','detail_oriented','dirty','disagreeable'];

BLACK.turn_on = function(css_id) {
    return function() {
        $('#' + css_id).addClass('on');
    }
}

BLACK.turn_off = function(css_id) {
    return function() {
        $('#' + css_id).removeClass('on');
    }
}


BLACK.demo = function(last_id) {
    $('.spotlight').removeClass('on');

    _.any(BLACK.ids, function(id, idx) {
        var time = BLACK.DELAY_MS * idx;

        if (id !== last_id) {
            setTimeout(BLACK.turn_on(id), time);
            setTimeout(BLACK.turn_off(id), time + BLACK.DELAY_MS);
        } else {
            // abort loop here - leave this one on
            setTimeout(BLACK.turn_on(id), time);
            return true;
        }
        return false;
    });

};

// main()
$(function() {
    $(document).click(function (event) {
        BLACK.demo('disagreeable');
    });
});
