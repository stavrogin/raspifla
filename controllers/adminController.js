exports.getVersion = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ version: '1.0' }));
};