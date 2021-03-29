const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
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

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: '1d' // 24 hours
      });
      res.status(200).send({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        accessToken: token,
        isAdmin: user.isAdmin
      });
      // }); 
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.getRealUser = (req, res, next) => {
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};



