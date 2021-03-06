const { authJwt } = require("../middleware");

module.exports = app => {
    const post = require("../controllers/post.controller.js");
    const auth = require("../controllers/auth.controller");

    var router = require("express").Router();

    // Create a new post
    router.post("/", [authJwt.verifyToken], post.createPost);

    // Afficher tout les articles
    router.get("/", post.findAll);

    // Afficher un article grâce a son ID
    router.get("/:id", post.findOne);

    // Update un article
    router.put("/:id", [authJwt.verifyToken], post.update);

    // Supprimer un article grâce a son ID
    router.delete("/:id", [authJwt.verifyToken], post.delete);

    // Delete all post
    router.delete("/", [authJwt.verifyToken], post.deleteAll);

    app.use('/api/post', router);
};