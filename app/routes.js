const receiver = require('./controllers/receiver');
const receiver_api = require('./controllers/api/receiver');
const gateway = require('./controllers/gateway');
const gateway_api = require('./controllers/api/gateway');
const application = require('./controllers/application');

var router = require('express').Router()

router.get('/', function(req, res) { res.redirect("/receiver"); });

router.get('/receiver', receiver.index);
router.get('/gateway', gateway.index);
router.get('/application', application.index);

router.get('/api/rp/sdr_params', receiver_api.sdr_params);
router.put('/api/rp/sdr_params', receiver_api.sdr_params);
router.get('/api/rp/status', receiver_api.status);
router.get('/api/rp/ce_values', receiver_api.ce_values);
router.get('/api/rp/pdsch_data', receiver_api.pdsch_data);
router.get('/api/rp/pdsch_status', receiver_api.pdsch_status);
router.get('/api/rp/mcch_data', receiver_api.mcch_data);
router.get('/api/rp/mcch_status', receiver_api.mcch_status);
router.get('/api/rp/mch_info', receiver_api.mch_info);
router.get('/api/rp/mch_data/:id', receiver_api.mch_data);
router.get('/api/rp/mch_status/:id', receiver_api.mch_status);


router.get('/api/gw/files', gateway_api.files);
router.get('/api/gw/services', gateway_api.services);
module.exports = router
