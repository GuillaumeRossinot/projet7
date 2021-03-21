const db = require("../models");
const Post = db.post;
const Comment = db.comments;
const User = db.users;
const Op = db.Sequelize.Op;

// Créer un nouvel article
exports.createPost = (req, res) => {
    // Validate request
    if (!req.body.title && !req.body.description && !req.body.image) {
        res.status(400).send({
            message: "Tout les champs doivent être remplie !"
        });
        return;
    }
    console.log("userId" + req.userId);

    // Création de l'article
    const post = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        userId: req.userId
    };

    // Insertion de l'articles en bdd
    Post.create(post)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Erreur lors de la création de l'article."
            });
        });
};

// Afficher tout les articles
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Post.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Il y a une eu erreur lors de la récuperation des articles."
            });
        });
};

// Afficher un articles grâce a son ID
exports.findOne = (req, res) => {
    console.log("userId " + req.userId);
    let token = req.headers["x-access-token"];
    console.log("token " + token);
    const id = req.params.id;

    Post.findByPk(id, { include: ["comment"] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de trouver l'article avec l'id=" + id
            });
        });
};

// Update un article
exports.update = (req, res) => {
    const id = req.params.id;

    Post.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "L'article a été mis a jour."
                });
            } else {
                res.send({
                    message: `Impossible de mettre a jour l'article avec l'id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Erreur lors de la mise a jour de l'article id=" + id
            });
        });
};

// Supprimer un article grâce a son ID
exports.delete = (req, res) => {
    const id = req.params.id;
    const postId = id;

    Comment.destroy({
        where: { postId: postId }
    })
    Post.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "L'article a été supprimer !"
                });
            } else {
                res.send({
                    message: `Impossible de supprimer l'article avec l'id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de supprimer l'article id=" + id
            });
        });
};

// Supprimer tout les articles
exports.deleteAll = (req, res) => {

    Comment.destroy({
        where: {},
        truncate: false
    })
    Post.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} tout les articles ont été supprimés!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Impossible de supprimer tout les articles."
            });
        });
};