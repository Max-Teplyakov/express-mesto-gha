const router = require('express').Router();
const {
  getUsers,
  getUsersId,
  createUser,
  updateProfileUser,
  updateAvatarUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUsersId);
router.post('/users', createUser);
router.patch('/users/me/avatar', updateAvatarUser);
router.patch('/users/me', updateProfileUser);

module.exports = router;
