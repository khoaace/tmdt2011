var express = require('express');
var router = express.Router();
var bookingController = require('../controllers/bookingController.js');

/*
 * GET
 */
router.get('/', bookingController.list);

/*
 * GET
 */
router.get('/:id', bookingController.show);

/*
 * POST
 */
router.post('/', bookingController.create);

/*
 * PUT
 */
router.put('/:id', bookingController.update);

/*
 * DELETE
 */
router.delete('/:id', bookingController.remove);

module.exports = router;
