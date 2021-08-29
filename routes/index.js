const router = require('express').Router();
const apiRoutes = require('./api');
// const htmlRoutes = require('./html/html-routes');

router.use('/api', apiRoutes);
// router.use('/', htmlRoutes);

router.use((req, res) => {
    res.status(404).send('<h1>😝 NOT FOUND!</h1>');
});

module.exports = router;