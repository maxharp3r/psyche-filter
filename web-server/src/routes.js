
exports.render_html = function(req, res) {
    var page_name = req.params.name;
    var path = './public/' + page_name + '.html';
    res.sendfile(path);
};

exports.render_jade = function(req, res) {
    var page_name = req.params.name;
    res.render(page_name, {title: 'profile cube'});
};

// post
exports.process_survey = function(req, res) {
    console.log(req.body);
    res.json({'success': true});
};
