const Psychologist = require('../models/psy');
const Patient = require('../models/patient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let userExists = (role === 'psychologist')
            ? await Psychologist.findOne({ email })
            : await Patient.findOne({ email });

        if (userExists) {
            return res.status(409).json({ message: "Email already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;
        if (role === 'psychologist') {
            newUser = await Psychologist.create({
                ...req.body,
                password: hashedPassword,
                languages: req.body.languages || [],
                specialization: req.body.specialization || [],
                geoLocation: req.body.geoLocation || { lat: null, long: null }
            });
        } else if (role === 'patient') {
            newUser = await Patient.create({
                ...req.body,
                password: hashedPassword,
                preferredLanguage: req.body.preferredLanguage || "undefined",
                issues: req.body.issues || [],
                locationPreference: req.body.locationPreference || 'No Preference'
            });
        } else {
            return res.status(400).json({ message: "Invalid user role specified." });
        }

        const token = generateToken(newUser);

        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [psychologist, patient] = await Promise.all([
            Psychologist.findOne({ email }),
            Patient.findOne({ email })
        ]);

        let user = psychologist || patient;

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password... Go home, you're drunk !" });
        }

        const token = generateToken(user);

        user = user.toObject();
        delete user.password;

        res.status(200).json({ 
            message: "User logged in successfully", 
            token, 
            user: user
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

getCurrentUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const [psychologist, patient] = await Promise.all([
            Psychologist.findById(userId),
            Patient.findById(userId)
        ]);

        let user = psychologist || patient;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user = user.toObject();
        delete user.password; // Supprimer le mot de passe du résultat

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data", error: error.message });
    }
};

updateUser = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;

    if (req.file) {
        updates.profilePicture = `/uploads/${req.file.filename}`;
    }

    try {
        let user = await Psychologist.findById(userId) || await Patient.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        Object.keys(updates).forEach(key => {
            if (key !== 'password') {
                user[key] = updates[key];
            }
        });

        await user.save();

        user = user.toObject();
        delete user.password; // Supprimer le mot de passe du résultat

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user data", error: error.message });
    }
};

module.exports = {
    register,
    login,
    getCurrentUser,
    updateUser
};
