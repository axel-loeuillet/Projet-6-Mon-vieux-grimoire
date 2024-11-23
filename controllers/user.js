const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const emailRegex = /[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+/
const passwordRegex = /^(?=.*[A-z])(?=.*[0-9])\S{8,10}$/

exports.signup = (req, res, next) => {
    if (!emailRegex.test(req.body.email)) {
        return res.status(410).json({ message: "Email non conforme" })
    }

    if (!passwordRegex.test(req.body.password)) {
        return res.status(410).json({ message: "Le mot de passe doit contenir au moins 8 catactères, dont une majuscule et un chiffre" })
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};