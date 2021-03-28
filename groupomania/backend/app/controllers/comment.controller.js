const db = require("../models");
const Comment = db.comments;

//Ajouter un commentaire
exports.createComment = (req, res) => {
    if (!req.body.text) {
        res.status(400).send({
            message: "Tout les champs doivent être remplie !!"
        });
        return;
    }

    const comment = {
        text: req.body.text,
        postId: req.body.postId,
        userId: req.userId
    };

    Comment.create(comment)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Erreur lors de l'ajout du commentaire."
            });
        });
};

// Update a post by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Comment.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tutorial was updated successfully."
                });
            } else {
                res.send({
                    message: `Impossible de mettre a jour le commentaire avec l'id=${id}!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Erreur lors de la mise a jour du commentaire id=" + id
            });
        });
};

// Supprimer un commentaire
exports.deleteComment = (req, res) => {
    const id = req.params.id;

    Comment.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Le commentaire a été supprimer !"
                });
            } else {
                res.send({
                    message: `Impossible de supprimer le commentaire avec l'id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Impossible de supprimer le commentaire id=" + id
            });
        });
};

// Supprimer tous les commentaires
exports.deleteAll = (req, res) => {
    Comment.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} tout les commentaires ont été supprimés !` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Impossible de supprimer tout les commentaires."
            });
        });
};