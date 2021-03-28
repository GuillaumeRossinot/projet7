const controller = require("../controllers/file.controller");


module.exports = app => {

    var router = require("express").Router();

    router.post("/upload", controller.upload);
    router.get("/files", controller.getListFiles);
    router.get("/files/:name", controller.download);

    app.use('/api', router);
};
