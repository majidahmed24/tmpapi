const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/post', userController.createUser);
router.get('/getall', userController.getAllUsers);
router.get('/getby/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);
router.post('/login', userController.login);
router.post('/login-otp', userController.loginWithOtp);

module.exports = router;