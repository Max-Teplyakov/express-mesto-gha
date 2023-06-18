const router = require('express').Router();
const {
  getUsers,
  getUsersId,
  createUser,
  updateProfileUser,
  updateAvatarUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUsersId);
router.post('/', createUser);
router.patch('/me/avatar', updateAvatarUser);
router.patch('/me', updateProfileUser);

module.exports = router;
