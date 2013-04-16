
exports.render_html = function(req, res) {
    var page_name = req.params.name;
    var path = './public/' + page_name + '.html';
    res.sendfile(path);
};

exports.process_survey = function(req, res) {
    console.log(req.body);
    res.json({'success': true});
};