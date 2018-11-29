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


router.post("/new-trip", tripsController.create);

router.get("/get-trip/:id", tripsController.show);

router.get("/get-list-trip-paginate", tripsController.getListPaginate);

router.post("/remove-trip", tripsController.remove);

router.get("/generator", tripsController.generateListTrip);

module.exports = router;
