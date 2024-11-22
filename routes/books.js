const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); // Middleware Multer
const bookCtrl = require('../controllers/book');
//ROUTE
router.post('/', auth, multer.upload, multer.optimize, bookCtrl.createBook);
router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.post('/:id/rating', auth, bookCtrl.ratingBook);
router.get('/:id', bookCtrl.getBook);
router.put('/:id', auth, multer.upload, multer.optimize, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;