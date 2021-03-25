const { authJwt } = require("../middleware");
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    app.get(
        "/api/getUser/:id",
        [authJwt.verifyToken],
        controller.getInfos
    );

    app.get(
        "/api/getUser/",
        [authJwt.verifyToken],
        controller.getAllUsers
    );

    app.post(
        "/api/auth/signup",
        [
            verifySignUp.checkDuplicateEmail,
        ],
        authController.signup
    );

    app.delete(
        "/api/user/:id",
        [authJwt.verifyToken],
        controller.delete
    );

    app.post("/api/auth/signin", authController.signin);

};
