const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const checkSauceInput = require('../middleware/check-sauce-input');


const stuffCtrl = require('../controllers/sauce');

router.get('/', auth, stuffCtrl.getAllSauces);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.put('/:id', auth, stuffCtrl.updateSauce); 
router.delete('/:id', auth, stuffCtrl.deleteSauce); 
router.post("/:id/like", auth, stuffCtrl.likeDislikeSauce)



module.exports = router;