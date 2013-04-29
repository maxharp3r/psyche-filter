
// namespace
var BLACK = {};

BLACK.DELAY_MS = 50;

BLACK.ids0 = ['absent-minded','accommodating','accurate','agitated','agreeable','aloof','altruistic','anti-intellectual','antisocial','anxious','argumentative','ashamed','assertive','blunt','brassy','callous','calm','carefree','careless','chaotic','cheerful','civic-minded','civil','clever','closed-minded','cocky','cold','collected','compassionate','competent','composed','confident','conforming','conscientious','conservative','considerate','controls_emotions','conventional','cool-headed','cooperative','creative','cynical','daydreamer','defiant','depressive','detail_oriented','dirty','disagreeable'];
BLACK.ids1 = ['disciplined','disenchanted','disheveled','distant','distracted','do-gooder','dogmatic','dominant','driven','dutiful','efficient','emotional','empathetic','enthusiastic','erratic','exit','friendly','fun-loving','generous','gracious','gruff','guarded','haphazard','happy','hard-nosed','hardened','hasty','headstrong','helpful','hopeful','hostile','hot-tempered','imaginative','imposing','impromptu','impulsive','inconsiderate','inconspicuous','indifferent','indulgent','industrious','inflexible','ingenious','innovative','institutional','insulting','intellectual','introspective'];
BLACK.ids2 = ['irritable','kind-hearted','lackadaisical','law_abiding','lax','liberal','mannerly','meek','methodical','mindless','misanthropic','modest','moody','mousy','musical','narrow-minded','nature_lover','neurotic','nurturing','open','open-minded','optimistic','orderly','organized','orthodox','outgoing','overwhelmed','passive-aggressive','perfectionist','persuasive','polite','practical','pragmatic','proud','purposeful','quick_thinker','quiet','rash','rational','receptive','relaxed','relentless','resilient','restrained','rigid','rude','sassy','scatter-brained'];
BLACK.ids3 = ['scruffy','self-assured','self-conscious','self-contained','self-controlled','self-involved','self-reflective','serene','sexual','short-sighted','shy','sloppy','sorrowful','spirited','spontaneous','stable','staunch','stodgy','straightforward','structured','stubborn','submissive','suspicious','systematic','tactless','takes_charge','talkative','tender','tidy','timid','tough','traditional','trusting','uncharitable','unenthusiastic','unforgiving','unprepared','unstable','utilitarian','vivacious','volatile','vulnerable','warm','well-groomed','withdrawn','witty','worrisome','zesty'];
BLACK.ids = BLACK.ids0.concat(BLACK.ids1, BLACK.ids2, BLACK.ids3);

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

BLACK.all_on = function() {
    $('.spotlight').addClass('on');
}

BLACK.entry_on = function() {
    $('.spotlight').removeClass('on');
    $('#entry-light').addClass('on');
}

BLACK.exit_on = function() {
    $('.spotlight').removeClass('on');
    $('#exit').addClass('on');
}

BLACK.all_off = function() {
    $('.spotlight').removeClass('on');
}

BLACK.debug_on = function() {
    $('#spotlight-boxes').addClass('debug');
}

BLACK.debug_off = function() {
    $('#spotlight-boxes').removeClass('debug');
}

BLACK.reload = function() {
    window.location.reload(true);
}

// words is comma separated, e.g.:
// foo, bar, baz
BLACK.go = function(words) {
    BLACK.all_off()

    var word_set = {}
    _.each(words.split(","), function(word) { word_set[word.trim()] = true; });

    _.each(BLACK.ids, function(id, idx) {
        var time = BLACK.DELAY_MS * idx;

        if (_.has(word_set, id)) {
            // leave this one on
            setTimeout(BLACK.turn_on(id), time);
        } else {
            setTimeout(BLACK.turn_on(id), time);
            setTimeout(BLACK.turn_off(id), time + BLACK.DELAY_MS);
        }
    });

};

BLACK.socket = io.connect(CONFIG.server_addr);

BLACK.socket.on('CMD:words', function (words) {
    console.log("on CMD:words", words);
    BLACK.go(words);
});

BLACK.socket.on('CMD:control', function (cmd) {
    console.log("on CMD:control", cmd);
    var fn = BLACK[cmd];
    if (fn) {
        fn();
    } else {
        console.warn("unexpected cmd: ", cmd);
    }
});
