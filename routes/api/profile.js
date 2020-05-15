const express = require("express");
const router = express.Router();
const profileHandler = require('./handlers/profile');
const passport = require("passport");

router.get("/test", profileHandler.test);
router.get("/", passport.authenticate("jwt", { session: false }), profileHandler.getCurrentProfile);
router.get("/all", profileHandler.getAllProfiles);
router.get("/handle/:handle", profileHandler.getProfileByHandle);
router.get("/user/:user_id", profileHandler.getProfileByUserId);
router.post("/", passport.authenticate("jwt", { session: false }), profileHandler.createOrUpdateProfile);
router.post("/experience", passport.authenticate("jwt", { session: false }), profileHandler.addExperience);
router.post("/education", passport.authenticate("jwt", { session: false }), profileHandler.addEducation);
router.delete("/experience/:exp_id", passport.authenticate("jwt", { session: false }), profileHandler.deleteExperience);
router.delete("/education/:edu_id", passport.authenticate("jwt", { session: false }), profileHandler.deleteEducation);
router.delete("/", passport.authenticate("jwt", { session: false }), profileHandler.deleteProfile);

module.exports = router;
