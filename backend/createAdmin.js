const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User'); // Ajuste le chemin selon ta structure

require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tiki-restaurant');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      name: 'Admin',
      email: 'admin@tiki.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Compte admin créé avec succès');
    
    // Identifiants à utiliser :
    console.log('Email: admin@tiki.com');
    console.log('Mot de passe: admin123');

  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createAdmin();