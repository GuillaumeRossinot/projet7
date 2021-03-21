const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log("nom :" + req.body.nom);
  console.log("prenom :" + req.body.prenom);
  console.log("email :" + req.body.email);
  console.log("password :" + bcrypt.hashSync(req.body.password, 8));
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

/* .then(user => {
    if (req.body.roles) {
      Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles
          }
        }
      }).then(roles => {
        user.setRoles(roles).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      });
    } else {
      // user role = 1
      user.setRoles([1]).then(() => {
        res.send({ message: "User was registered successfully!" });
      });
    }
  })
  .catch(err => {
    res.status(500).send({ message: err.message });
  });
}; */

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

      /*             var authorities = [];
                  user.getRoles().then(roles => {
                      for (let i = 0; i < roles.length; i++) {
                          authorities.push("Utilisateur admin");
                      }*/
      res.status(200).send({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        accessToken: token
      });
      // }); 
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.getRealUser = (req, res, next) => {
  console.log("test");
  console.log("req " + req);

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  console.log("token2 " + token);
  console.log("config.secret " + config.secret);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    console.log("decoded.id " + decoded.id);
    next();
  });
};
