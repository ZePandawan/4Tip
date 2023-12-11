const {checkAdmin} = require("../functions")


exports.run = async (client, interaction) => {
    let isUserAdmin = checkAdmin(client, interaction);
    // isUserAdmin = true --> admin
    // isUserAdmin = false --> pas admin

    isUserAdmin ? console.log("admin") : console.log("pas admin");
};