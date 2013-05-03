
var _ = require('underscore');

var QUESTIONS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];

var ANSWERS_TO_CATS = {
    "01:1": ["volatility","enthusiasm","assertiveness"],
    "01:2": ["x_volatility","compassion"],
    "01:3": ["withdrawal","assertiveness","intellect","orderliness"],
    "01:4": ["volatility","x_politeness","openness"],
    "01:5": ["x_enthusiasm","x_politeness","x_intellect","x_industriousness"],
    "01:6": ["politeness","openness","orderliness"],
    "02:1": ["x_volatility","compassion","openness"],
    "02:2": ["x_enthusiasm","x_assertiveness","politeness","x_openness"],
    "02:3": ["x_withdrawal","enthusiasm","x_intellect","x_industriousness"],
    "02:4": ["assertiveness","x_compassion","x_intellect","x_openness"],
    "02:5": ["volatility","assertiveness","x_politeness"],
    "02:6": ["politeness","intellect","openness","industriousness"],
    "03:1": ["withdrawal","x_assertiveness","x_compassion","industriousness"],
    "03:2": ["x_withdrawal","x_politeness","x_intellect","x_orderliness"],
    "04:1": ["assertiveness","x_compassion","industriousness"],
    "04:2": ["enthusiasm","assertiveness","x_intellect"],
    "04:3": ["x_withdrawal","enthusiasm","openness","x_orderliness"],
    "04:4": ["x_assertiveness","x_politeness","openness","x_orderliness"],
    "04:5": ["x_enthusiasm","assertiveness","x_openness","industriousness"],
    "04:6": ["withdrawal","assertiveness","x_compassion","orderliness"],
    "05:1": ["assertiveness","x_compassion","x_intellect"],
    "05:2": ["x_volatility","compassion","x_openness"],
    "05:3": ["x_volatility","x_enthusiasm","x_orderliness"],
    "06:1": ["withdrawal","x_compassion","x_intellect","x_orderliness"],
    "06:2": ["enthusiasm","x_assertiveness","compassion","x_industriousness"],
    "07:1": ["compassion","politeness","x_intellect","x_openness"],
    "07:2": ["enthusiasm","compassion","openness","x_industriousness"],
    "07:3": ["x_assertiveness","x_politeness","x_intellect"],
    "07:4": ["withdrawal","x_assertiveness","intellect","orderliness"],
    "07:5": ["withdrawal","x_enthusiasm","x_intellect","x_industriousness"],
    "07:6": ["assertiveness","x_politeness","intellect","industriousness"],
    "08:1": ["x_assertiveness","intellect"],
    "08:2": ["compassion","openness"],
    "08:3": ["x_industriousness"],
    "08:4": ["x_assertiveness","x_intellect"],
    "08:5": ["x_intellect","x_orderliness"],
    "08:6": ["x_openness","industriousness"],
    "09:1": ["assertiveness","intellect","industriousness"],
    "09:2": ["x_assertiveness","politeness"],
    "09:3": ["assertiveness","x_compassion","x_openness"],
    "09:4": ["withdrawal","x_enthusiasm","x_politeness"],
    "09:5": ["volatility","assertiveness","x_orderliness"],
    "09:6": ["x_withdrawal","enthusiasm","openness"],
    "10:1": ["volatility","x_politeness","industriousness","orderliness"],
    "10:2": ["withdrawal","x_enthusiasm","politeness","intellect"],
    "11:1": ["intellect","industriousness"],
    "11:2": ["x_intellect","x_openness","x_industriousness"],
    "12:1": ["enthusiasm","openness"],
    "12:2": ["x_enthusiasm","x_industriousness"],
    "12:3": ["x_compassion","x_openness"],
    "13:1": ["compassion","openness"],
    "13:2": ["enthusiasm","compassion"],
    "13:3": ["x_assertiveness","orderliness"],
    "13:4": ["assertiveness","industriousness"],
    "13:5": ["x_compassion","intellect"],
    "13:6": ["x_intellect","x_industriousness"],
    "15:1": ["enthusiasm","politeness","openness"],
    "15:2": ["x_enthusiasm","x_politeness","x_openness"],
    "16:1": ["volatility","assertiveness","x_politeness"],
    "16:2": ["x_assertiveness","politeness","orderliness"],
    "16:3": ["assertiveness","x_politeness","openness"],
    "16:4": ["withdrawal","x_enthusiasm","politeness"],
    "16:5": ["x_volatility","politeness","x_orderliness"],
    "16:6": ["x_withdrawal","x_assertiveness","orderliness"],
    "17:1": ["x_enthusiasm","politeness"],
    "17:2": ["x_enthusiasm","x_openness","orderliness"],
    "17:3": ["x_withdrawal","enthusiasm","x_politeness"],
    "17:4": ["volatility","x_politeness","x_orderliness"],
    "18:1": ["x_volatility"],
    "18:2": ["assertiveness"],
    "18:3": ["x_withdrawal"],
    "18:4": ["openness"],
    "18:5": ["x_compassion"],
    "18:6": ["compassion"],
    "19:1": ["x_orderliness"],
    "19:2": ["x_withdrawal"],
    "19:3": ["intellect"],
    "19:4": ["x_openness"],
    "19:5": ["x_compassion"],
    "19:6": ["withdrawal","x_assertiveness"],
    "20:1": ["x_politeness","x_orderliness"],
    "20:2": ["politeness","orderliness"],
    "21:1": ["x_volatility","orderliness"],
    "21:2": ["x_compassion","x_intellect"],
    "21:3": ["withdrawal","x_assertiveness"],
    "21:4": ["compassion","openness"],
    "21:5": ["x_volatility","industriousness"],
    "21:6": ["x_withdrawal","orderliness"],
    "22:1": ["volatility","x_compassion","x_orderliness"],
    "22:2": ["x_volatility","compassion","orderliness"],
    "24:1": ["volatility","x_enthusiasm","x_intellect"],
    "24:2": ["withdrawal","assertiveness","x_industriousness"],
    "24:3": ["volatility","x_compassion","x_openness"],
    "24:4": ["x_withdrawal","enthusiasm","compassion"],
    "24:5": ["x_volatility","x_enthusiasm","politeness"],
    "24:6": ["x_withdrawal","assertiveness","openness"],
    "25:1": ["assertiveness","compassion","openness"],
    "25:2": ["x_assertiveness","x_compassion","x_openness"]
};

var CATS_TO_WORDS = {
    "volatility": ["volatile", "moody", "impulsive", "unstable", "hot-tempered", "erratic", "irritable", "hostile", "emotional", "agitated"],
    "x_volatility": ["controls_emotions", "stable", "relaxed", "restrained", "calm", "cool-headed", "collected", "self-controlled", "serene"],
    "withdrawal": ["withdrawn", "worrisome", "overwhelmed", "depressive", "ashamed", "sorrowful", "vulnerable", "anxious", "self-conscious", "neurotic"],
    "x_withdrawal": ["self-assured", "proud", "optimistic", "hopeful", "vivacious", "carefree", "happy", "tough", "resilient"],
    "enthusiasm": ["enthusiastic", "friendly", "fun-loving", "warm", "talkative", "cheerful", "zesty", "spirited", "outgoing"],
    "x_enthusiasm": ["distant", "guarded", "cold", "shy", "quiet", "antisocial", "unenthusiastic", "disenchanted", "introspective"],
    "assertiveness": ["assertive", "takes_charge", "persuasive", "driven", "dominant", "brassy", "cocky", "sassy", "defiant", "confident"],
    "x_assertiveness": ["lackadaisical", "meek", "mousy", "modest", "passive-aggressive", "timid", "self-contained", "submissive", "inconspicuous", "undemanding"],
    "compassion": ["compassionate", "tender", "empathetic", "kind-hearted", "nurturing", "generous", "altruistic", "do-gooder", "trusting"],
    "x_compassion": ["self-involved", "cynical", "indifferent", "uncharitable", "unforgiving", "hardened", "callous", "misanthropic", "suspicious"],
    "politeness": ["polite", "civic-minded", "helpful", "accommodating", "cooperative", "gracious", "agreeable", "civil", "considerate", "mannerly"],
    "x_politeness": ["argumentative", "blunt", "disagreeable", "gruff", "imposing", "inconsiderate", "inflexible", "insulting", "rude", "tactless"],
    "intellect": ["intellectual", "witty", "ingenious", "quick_thinker", "pragmatic", "open-minded", "competent", "liberal", "clever", "receptive"],
    "x_intellect": ["institutional", "utilitarian", "straightforward", "practical", "traditional", "dogmatic", "anti-intellectual", "conservative", "narrow-minded", "conventional"],
    "openness": ["open", "nature_lover", "self-reflective", "musical", "creative", "imaginative", "sexual", "innovative", "daydreamer"],
    "x_openness": ["hard-nosed", "rigid", "closed-minded", "relentless", "conforming", "orthodox", "stodgy", "short-sighted", "headstrong", "staunch"],
    "industriousness": ["industrious", "purposeful", "efficient", "systematic", "methodical", "accurate", "disciplined", "conscientious", "rational", "dutiful"],
    "x_industriousness": ["scatter-brained", "distracted", "lax", "indulgent", "aloof", "careless", "hasty", "impulsive", "mindless", "rash"],
    "orderliness": ["orderly", "tidy", "composed", "law_abiding", "detail_oriented", "well-groomed", "organized", "perfectionist", "structured"],
    "x_orderliness": ["unprepared", "haphazard", "disheveled", "scruffy", "sloppy", "dirty", "chaotic", "spontaneous", "absent-minded"]
};

var SUPER1 = ["volatility", "x_volatility", "withdrawal", "x_withdrawal"];
var SUPER2 = ["enthusiasm", "x_enthusiasm", "assertiveness", "x_assertiveness"];
var SUPER3 = ["compassion", "x_compassion", "politeness", "x_politeness"];
var SUPER4 = ["intellect", "x_intellect", "openness", "x_openness"];
var SUPER5 = ["industriousness", "x_industriousness", "orderliness", "x_orderliness"];
var ALL_SUPER_CATS = [SUPER1, SUPER2, SUPER3, SUPER4, SUPER5];

exports.survey_to_word_list = function(survey_results) {
    // FAKE
    // var survey_results = { '10': '1', '11': '1', '12': '1', '13': '1', '14': '1', '15': '1', '16': '1', '17': '1', '18': '1', '19': '1', '20': '1', '21': '1', '22': '1', '23': '1', '24': '1', name: 'Max', '01': '1', '02': '1', '03': '1', '04': '1', '05': '1', '06': '1', '07': '1', '08': '1', '09': '1' };
    // var survey_results = { '10': '2', '11': '2', '12': '3', '13': '6', '14': '6', '15': '2', '16': '6', '17': '4', '18': '6', '19': '6', '20': '2', '21': '6', '22': '2', '23': '6', '24': '6', name: 'Joo Aoo', '01': '6', '02': '6', '03': '2', '04': '6', '05': '3', '06': '2', '07': '6', '08': '6', '09': '6' };

    // build a list of cats (contains dups)
    var cats = [];
    _.each(QUESTIONS, function(q) {
        var response = survey_results[q];
        if (response) {
            var key = q + ":" + response;
            var rsp_cats = ANSWERS_TO_CATS[key];
            if (rsp_cats) {
                cats = cats.concat(rsp_cats);
            }
        }
    });
    // console.log(cats);

    // list of cats => map of cats to counts
    var cats_count = _.reduce(cats, function(memo, item) {
        if (!memo[item]) {
            memo[item] = 1;
        } else {
            memo[item] = memo[item] + 1;
        }
        return memo;
    }, {});
    // console.log(cats_count);

    var top_category = _.max(_.keys(cats_count), function (key) { return cats_count[key]; });
    // console.log("top_category: ", top_category);

    // list of words to light up
    var the_words = [];

    // find the top cat from each super-category
    _.each(ALL_SUPER_CATS, function(super_cat) {
        // TODO: what about ties?  Should we choose randomly?
        var sorted_cats = _.sortBy(super_cat, function(word) {
            return cats_count[word] || 0;
        });
        var best_cat = _.last(sorted_cats);
        // console.log("best cat", best_cat);

        // append the words
        the_words = the_words.concat(CATS_TO_WORDS[best_cat]);
    });
    // console.log("the words", the_words);

    var survey_scores = {
        'words': the_words,
        'top_category': top_category
    }
    return survey_scores;
};



