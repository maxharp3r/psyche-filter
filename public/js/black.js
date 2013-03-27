
// namespace
var BLACK = {};

BLACK.DELAY_MS = 100;

BLACK.ids = ['foo', 'bar', 'baz'];

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
            console.log("id:", id);
            setTimeout(BLACK.turn_on(id), time);
            setTimeout(BLACK.turn_off(id), time + BLACK.DELAY_MS);
        } else {
            // stop here
            setTimeout(BLACK.turn_on(id), time);
            return true;
        }
        return false;
    });

};

// main()
$(function() {
    $(document).click(function (event) {
        BLACK.demo('bar');
    });
});
