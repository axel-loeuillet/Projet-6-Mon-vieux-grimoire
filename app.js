const express = require('express');
const mongoose = require('mongoose');
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const path = require('path');

//CONNEXION A MONGOOSE
mongoose.connect('mongodb+srv://axlo_:UxPQgVxT21D6JYoS@projet6.3qfmg.mongodb.net/?retryWrites=true&w=majority&appName=Projet6',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//AJOUT DES HEADERS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;