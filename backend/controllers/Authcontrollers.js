const User = require('../Models/User'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');



// Register function
const register = async (req, res) => {
  console.log('Requête reçue:', req.body);
  try {
    const { username, email, password, confirmPassword, number} = req.body;
    
    if (!username || !email || !password || !confirmPassword || !number ) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    const user = new User({ 
      username, 
      email, 
      password, 
      number
    });
    
    console.log('User object before saving:', user);
    await user.save();
    

     res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        number: user.number
      }
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};


/////////////////////////////////////////////////////////////



// // Edit profile route 
// const editProfile = async (req, res) => {
//   try {
//     const { userId, username, email, number } = req.body;
    
//     if (!userId || !username || !email || !number) {
//       return res.status(400).json({ message: 'Tous les champs sont requis' });
//     }
    
//     // Vérifier que l'utilisateur existe
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }
    
//     // Vérifier si l'email a changé et s'il n'est pas déjà utilisé par un autre utilisateur
//     if (email !== user.email) {
//       const existingUser = await User.findOne({ email });
//       if (existingUser && existingUser._id.toString() !== userId) {
//         return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre compte' });
//       }
//     }
    
//   } catch (error) {
//     console.error('Erreur lors de la mise à jour du profil:', error);
//     res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
//   }
// };




/////////////////////////////////////////////////////////////

// Login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      }
    });
    
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};





module.exports = { register, login};