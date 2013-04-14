
exports.render_html = function(req, res) {
    var page_name = req.params.name;
    var path = './public/' + page_name + '.html';
    res.sendfile(path);
};