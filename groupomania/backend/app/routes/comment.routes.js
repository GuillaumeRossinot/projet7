module.exports = app => {
    const comments = require("../controllers/comment.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", comments.createComment);

    // Update un commentaire
    router.put("/:id", comments.update);

    // Supprimer un commentaire grâce a son ID
    router.delete("/:id", comments.deleteComment);

    // Supprimer tout les commentaires
    router.delete("/", comments.deleteAll);

    app.use('/api/comments', router);
};