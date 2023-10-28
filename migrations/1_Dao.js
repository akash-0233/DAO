// const Migrations = artifacts.require("DAO");

// module.exports = function (deployer) {

//   deployer.deploy(Migrations, "51");
// };

const Migrations = artifacts.require("DAO");

module.exports = async function (deployer) {
 deployer.deploy(Migrations, { gas: 8000000 })
    .then(() => Migrations.deployed())
    .then(instance => {
      console.log("DAO deployed at address: " + instance.address);
    });
};
