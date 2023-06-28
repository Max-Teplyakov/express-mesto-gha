const router = require('express').Router();
const {
  getUsers,
  getUsersId,
  updateProfileUser,
  updateAvatarUser,
  getUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUsersId);
router.patch('/me/avatar', updateAvatarUser);
router.patch('/me', updateProfileUser);

module.exports = router;
