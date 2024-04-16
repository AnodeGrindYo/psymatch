const Psychologist = require('../models/psy');
const Patient = require('../models/patient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Utility function to generate a JWT
generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Register function for both psychologists and patients
register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if user already exists
        let userExists = (role === 'psychologist')
            ? await Psychologist.findOne({ email })
            : await Patient.findOne({ email });

        if (userExists) {
            return res.status(409).json({ message: "Email already in use." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user according to the role
        let newUser;
        if (role === 'psychologist') {
            newUser = await Psychologist.create({ ...req.body, password: hashedPassword });
        } else if (role === 'patient') {
            newUser = await Patient.create({ ...req.body, password: hashedPassword });
        } else {
            return res.status(400).json({ message: "Invalid user role specified." });
        }

        // Generate JWT Token
        const token = generateToken(newUser);

        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login function for both psychologists and patients
login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Find user by email and role
        let user = (role === 'psychologist')
            ? await Psychologist.findOne({ email })
            : await Patient.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password... Go hoem, you're drunk !" });
        }

        // Generate JWT Token
        const token = generateToken(user);

        res.status(200).json({ message: "User logged in successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

module.exports = {
    register,
    login
};
