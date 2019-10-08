exports.getChartView = (req, res, next) => {
    res.render('chart', {
        pageTitle: 'Chart view',
      });
};
