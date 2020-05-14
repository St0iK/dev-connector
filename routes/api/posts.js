const express = require('express');
const router = express.Router();
const passport = require('passport');
const postsHandler = require('./handlers/posts');

router.get('/test', postsHandler.test);
router.get('/', postsHandler.getPosts);
router.get('/:id', postsHandler.getPostById);
router.post('/', passport.authenticate('jwt', { session: false }), postsHandler.createPost);
router.delete('/:id', passport.authenticate('jwt', { session: false }), postsHandler.deletePost);
router.post('/like/:id', passport.authenticate('jwt', { session: false }), postsHandler.likePost);
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), postsHandler.unlikePost);
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), postsHandler.addComment);
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), postsHandler.deleteComment);

module.exports = router;
