const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/AuthControllers');

// Authentication routes
router.post('/register', register);
router.post('/login', login);
// router.put('/edit-profile', editProfile);


module.exports = router;