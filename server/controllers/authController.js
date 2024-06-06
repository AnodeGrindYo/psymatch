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
    console.log("register function started");
    const { email, password, role } = req.body;

    console.log("Received body:", req.body);

    try {
        // Check if user already exists
        console.log("Checking if user already exists...");
        let userExists = (role === 'psychologist')
            ? await Psychologist.findOne({ email })
            : await Patient.findOne({ email });

        if (userExists) {
            console.log("Email already in use:", email);
            return res.status(409).json({ message: "Email already in use." });
        }

        // Hash the password
        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user according to the role
        let newUser;
        if (role === 'psychologist') {
            console.log("Creating psychologist...");
            newUser = await Psychologist.create({
                ...req.body,
                password: hashedPassword,
                // Ensure required fields are populated
                languages: req.body.languages || [],
                specialization: req.body.specialization || [],
                geoLocation: req.body.geoLocation || { lat: null, long: null }
            });
        } else if (role === 'patient') {
            console.log("Creating patient...");
            newUser = await Patient.create({
                ...req.body,
                password: hashedPassword,
                // Ensure required fields are populated
                preferredLanguage: req.body.preferredLanguage || "undefined",
                issues: req.body.issues || [],
                locationPreference: req.body.locationPreference || 'No Preference'
            });
        } else {
            console.log("Invalid user role specified:", role);
            return res.status(400).json({ message: "Invalid user role specified." });
        }

        // Generate JWT Token
        console.log("Generating token...");
        const token = generateToken(newUser);

        console.log("User created successfully:", newUser);
        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        console.log("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};


// Login function for both psychologists and patients
// login = async (req, res) => {
//     const { email, password, role } = req.body;

//     console.log("Starting login process...");
//     console.log("Received login details:", req.body);

//     try {
//         console.log(`Looking up user: ${email} with role: ${role}`);
//         // Find user by email and role
//         let user = (role === 'psychologist')
//             ? await Psychologist.findOne({ email })
//             : await Patient.findOne({ email });

//         if (!user) {
//             console.log("User not found for email:", email);
//             return res.status(401).json({ message: "User not found" });
//         }

//         console.log("User found, comparing password...");
//         // Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             console.log("Password comparison failed");
//             return res.status(401).json({ message: "Invalid password... Go home, you're drunk !" });
//         }

//         console.log("Password match successful, generating token...");
//         // Generate JWT Token
//         const token = generateToken(user);

//         // supprime le mot de passe du résultat
//         user = user.toObject();
//         delete user.password;

//         console.log("Token generated successfully, logging in user...");
//         res.status(200).json({ 
//             message: "User logged in successfully", 
//             token, 
//             user: user
//         });
//     } catch (error) {
//         console.log("Error during login process:", error);
//         res.status(500).json({ message: "Error logging in", error: error.message });
//     }
// };
login = async (req, res) => {
    const { email, password } = req.body;

    console.log("Starting login process...");
    console.log("Received login details:", req.body);

    try {
        console.log(`Looking up user: ${email}`);

        // Find user by email in both collections
        const [psychologist, patient] = await Promise.all([
            Psychologist.findOne({ email }),
            Patient.findOne({ email })
        ]);

        // Determine if user is found and in which collection
        let user = psychologist || patient;

        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({ message: "User not found" });
        }

        console.log("User found, comparing password...");
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password comparison failed");
            return res.status(401).json({ message: "Invalid password... Go home, you're drunk !" });
        }

        console.log("Password match successful, generating token...");
        // Generate JWT Token
        const token = generateToken(user);

        // supprime le mot de passe du résultat
        user = user.toObject();
        delete user.password;

        console.log("Token generated successfully, logging in user...");
        res.status(200).json({ 
            message: "User logged in successfully", 
            token, 
            user: user
        });
    } catch (error) {
        console.log("Error during login process:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};


module.exports = {
    register,
    login
};
