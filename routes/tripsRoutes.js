var express = require('express');
var router = express.Router();
var tripsController = require('../controllers/tripsController.js');

/*
 * GET
 */
router.get('/', tripsController.list);

/*
 * GET
 */
router.get('/:id', tripsController.show);

/*
 * POST
 */
router.post('/', tripsController.create);

/*
 * PUT
 */
router.put('/:id', tripsController.update);

/*
 * DELETE
 */
router.delete('/:id', tripsController.remove);

module.exports = router;
