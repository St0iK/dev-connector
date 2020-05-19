const validateProfileInput = require("../../../validation/profile");
const validateExperienceInput = require("../../../validation/experience");
const validateEducationInput = require("../../../validation/education");
const Profile = require("../../../models/Profile");
const User = require("../../../models/User");

/**
 * Get Current Profile, user exists on the request object 
 */
const getCurrentProfile = async (req, res) => {
    const errors = {};
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]).exec()
        if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
        }
        res.json(profile);
    } catch (error) {
        res.status(404).json(error)
    }
}

/**
 * Get All Profiles
 */
const getAllProfiles = async (req, res) => {
    const errors = {};
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]).exec();
        if (!profiles) {
            errors.noprofile = "There are no profiles";
            return res.status(404).json(errors);
        }
        res.json(profiles);
    } catch (error) {
        res.status(404).json({ profile: "There are no profiles" });
    }
}

/**
 * Get Profile By Handle
 */
const getProfileByHandle = async (req, res) => {

    const errors = {};
    try {
        const profile = await Profile.findOne({ handle: req.params.handle }).populate("user", ["name", "avatar"]).exec();
        if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
        }
        res.json(profile);
    } catch (error) {
        res.status(404).json(error)
    }
}

/**
 * Get Profile by User Id
 */
const getProfileByUserId = async (req, res) => {
    const errors = {};
    try {
        const profile = await Profile.findOne({ handle: req.params.user_id }).populate("user", ["name", "avatar"]).exec()
        if (!profile) {
            errors.noprofile = "There is no profile for this user";
            return res.status(404).json(errors);
        }
        res.json(profile);
    } catch (error) {
        res.status(404).json(error)
    }
}

/**
 * Create or Update profile 
 */
const createOrUpdateProfile = async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
        profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== "undefined") {
        profileFields.skills = req.body.skills.split(",");
    }

    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    const profile = await Profile.findOne({ user: req.user.id }).exec();
    if (profile) {
        // Update
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
        );
        res.json(updatedProfile)
    } else {
        // Check if handle exists
        const userWithHandle = await Profile.findOne({ handle: profileFields.handle }).exec();
        if (userWithHandle) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
        }

        // Save Profile
        const createdProfile = await new Profile(profileFields).save();
        res.json(createdProfile)
    }
}

/**
 * Add Experience
 */
const addExperience = async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    const profile = await Profile.findOne({ user: req.user.id }).exec();
    const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
    };

    // Add to exp array
    profile.experience.unshift(newExp);

    const updatedProfile = await profile.save();
    res.json(updatedProfile)

}

/**
 * 
 */
const addEducation = async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    const profile = await Profile.findOne({ user: req.user.id }).exec();
    const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
    };

    // Add to exp array
    profile.education.unshift(newEdu);

    const updatedProfile = await profile.save();
    res.json(updatedProfile)
}

/**
 * Delete Experience
 * @param {*} req 
 * @param {*} res 
 */
const deleteExperience = async (req, res) => {
    const profile = await Profile.findOne({ user: req.user.id }).catch((err) => res.status(404).json(err));
    // Get remove index
    const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);

    // Splice out of array
    profile.experience.splice(removeIndex, 1);

    // Save
    const updatedProfile = await profile.save();
    res.json(updatedProfile)
}

const deleteEducation = async (req, res) => {
    const profile = await Profile.findOne({ user: req.user.id }).catch((err) => res.status(404).json(err));
    // Get remove index
    const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id);

    // Splice out of array
    profile.education.splice(removeIndex, 1);

    // Save
    const updatedProfile = await profile.save();
    res.json(updatedProfile)
}

const deleteProfile = async (req, res) => {
    // Remove the profile
    await Profile.findOneAndRemove({ user: req.user.id }).exec();
    // Remove the user
    await User.findOneAndRemove({ _id: req.user.id }).exec();

    res.json({ success: true })
}

module.exports = {
    getCurrentProfile,
    getAllProfiles,
    getProfileByHandle,
    getProfileByUserId,
    createOrUpdateProfile,
    addExperience,
    addEducation,
    deleteExperience,
    deleteEducation,
    deleteProfile
}