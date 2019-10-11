exports.getVersion = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({ version: '1.0' });
};