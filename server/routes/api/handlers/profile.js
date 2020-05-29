const Profile = require("../../../models/Profile");
const User = require("../../../models/User");
const { validationResult } = require('express-validator');
const errorFormatter = require('../../../utils/error-formatter');

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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errorFormatter(errors));
    }

    const profileFields = {
        user: req.user.id,
        handle: req.body.handle,
        company: req.body.company,
        website: req.body.website,
        location: req.body.location,
        bio: req.body.handle,
        status: req.body.handle,
        githubusername: req.body.githubusername,
        skills: (typeof req.body.skills !== "undefined") ? req.body.skills.split(",") : null,
        social: {
            youtube: req.body.youtube,
            twitter: req.body.twitter,
            facebook: req.body.facebook,
            linkedin: req.body.linkedin,
            instagram: req.body.instagram,
        }
    };

    const profile = await Profile.findOne({ user: req.user.id }).exec();
    if (profile) {
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
        );
        res.json(updatedProfile)
    } else {
        const userWithHandle = await Profile.findOne({ handle: profileFields.handle }).exec();
        if (userWithHandle) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
        }

        const createdProfile = await new Profile(profileFields).save();
        res.json(createdProfile)
    }
}

/**
 * Add Experience
 */
const addExperience = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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

const addEducation = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
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