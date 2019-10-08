exports.getChartView = (req, res, next) => {
    console.log('yo');
    res.render('chart', {
        pageTitle: 'Chart view',
      });
};
