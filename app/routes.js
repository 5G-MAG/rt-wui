const modem = require('./controllers/modem');
const modem_api = require('./controllers/api/modem');
const middleware = require('./controllers/middleware');
const middleware_api = require('./controllers/api/middleware');
const application = require('./controllers/application');

var router = require('express').Router()

router.get('/', function(req, res) { res.redirect("/modem"); });

router.get('/modem', modem.index);
router.get('/middleware', middleware.index);
router.get('/application', application.index);

router.get('/api/modem/sdr_params', modem_api.sdr_params);
router.put('/api/modem/sdr_params', modem_api.sdr_params);
router.get('/api/modem/status', modem_api.status);
router.get('/api/modem/ce_values', modem_api.ce_values);
router.get('/api/modem/pdsch_data', modem_api.pdsch_data);
router.get('/api/modem/pdsch_status', modem_api.pdsch_status);
router.get('/api/modem/mcch_data', modem_api.mcch_data);
router.get('/api/modem/mcch_status', modem_api.mcch_status);
router.get('/api/modem/mch_info', modem_api.mch_info);
router.get('/api/modem/mch_data/:id', modem_api.mch_data);
router.get('/api/modem/mch_status/:id', modem_api.mch_status);


router.get('/api/mw/files', middleware_api.files);
router.get('/api/mw/services', middleware_api.services);
module.exports = router
