const db = require("../models");
const fs = require("fs");
const directoryPath = __basedir + "/resources/static/assets/uploads/";
const Post = db.post;
const Comment = db.comments;
const User = db.users;
const Op = db.Sequelize.Op;
var FileReader = require('filereader');
const { deleteFile } = require("./file.controller");

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: posts } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, posts, totalPages, currentPage };
};

// Créer un nouvel article
exports.createPost = (req, res) => {
    // Validate request
    if (!req.body.title && !req.body.description && !req.body.image) {
        res.status(400).send({
            message: "Tout les champs doivent être remplie !"
        });
        return;
    }
    var fichierSplit = req.body.image.split("\\");

    // Création de l'article
    const post = {
        title: req.body.title,
        description: req.body.description,
        image: 'image',
        imageEncoded: '',
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
    const { page, size } = req.query;
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    const { limit, offset } = getPagination(page, size);

    Post.findAndCountAll({ where: condition, limit, offset })
        .then(data => {
            data.rows.forEach(element => {
                var profilePicture = Buffer.from(element.imageEncoded).toString('base64');
                element.imageEncoded = profilePicture;
            });
            const response = getPagingData(data, page, limit);

            res.send(response);
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
    let token = req.headers["x-access-token"];
    const id = req.params.id;


    Post.findByPk(id, { include: [{ all: true, nested: true }] })
        .then(data => {
            const profilePicture = Buffer.from(data.imageEncoded).toString('base64');
            data.imageEncoded = profilePicture;
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de trouver l'article avec l'id=" + id + "." + err
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
    const postId = req.params.id;

    Comment.destroy({
        where: { postId: postId }
    })
    Post.destroy({
        where: { id: postId }
    })
        .then(num => {
            if (num == 1) {
                const fileName = __basedir + "/resources/static/assets/uploads/" + postId + "-image";

                fs.unlink(fileName, (err) => {
                    if (err) {
                        return
                    }
                })
                res.send({
                    message: "L'article a été supprimer !"
                });
            } else {
                res.send({
                    message: `Impossible de supprimer l'article avec l'id=${postId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de supprimer l'article id=" + postId
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