const db = require("../models");
const { verifySignUp } = require("../middleware");
const User = db.users;
const Op = db.Sequelize.Op;

// Créer un nouvelle utilisateur
exports.createUser = (req, res) => {
    // Validate request
    if (!req.body.nom && !req.body.prenom && !req.body.email && !req.body.password) {
        res.status(400).send({
            message: "Tout les champs doivent être remplie !"
        });
        return;
    }

    if (verifySignUp) {
        res.status(400).send({
            message: "L'email est déjà utilisé !"
        });
    }

    // Create a Tutorial
    const user = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: req.body.password,
        isAdmin: false
    };

    // Save Tutorial in the database
    User.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Une erreur s'est produite lors de la création de l'utilisateur !"
            });
        });
};

// Connexion utilisateur
exports.login = (req, res) => {
    if (!req.body.email && !req.body.password) {
        res.status(400).send({
            message: "Tout les champs doivent être remplie !"
        });
        return;
    }

};

exports.getInfos = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de trouver l'utilisateur avec l'id=" + id
            });
        });
};
