const uploadFile = require("../middleware/upload");
const directoryPath = __basedir + "/resources/static/assets/uploads/";
const db = require("../models");
const fs = require("fs");
const baseUrl = "http://localhost:8080/files/";
const Post = db.post;

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);
        var fichierSplit = req.file.originalname.split("\\");
        var bitmap = fs.readFileSync(directoryPath + req.body.idPost + "-image");

        Post.update(
            { imageEncoded: bitmap },
            { where: { id: req.body.idPost } }
        )
            .catch(err =>
                console.log(err)
            );

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

        res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
        });
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];

        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file,
            });
        });

        res.status(200).send(fileInfos);
    });
};

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};


const deleteFile = (req, res) => {
    const fichierSplit = req.body.image;

}

module.exports = {
    upload,
    getListFiles,
    download,
    deleteFile
};
