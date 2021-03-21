module.exports = (sequelize, Sequelize) => {
    const Posts = sequelize.define("post", {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        }
    });

    return Posts;
};