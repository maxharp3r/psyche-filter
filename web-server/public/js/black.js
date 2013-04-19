
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
            //return true;
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
