const Migrations = artifacts.require("DAO");

module.exports = function (deployer) {

  deployer.deploy(Migrations)
  .then(() => Migrations.deployed())
    .then(instance => {
       console.log("DAO deployed at address: " + instance.address);
    });
};

// const Migrations = artifacts.require("DAO");

// module.exports = async function (deployer) {
//  deployer.deploy(Migrations, { gas: 800000 })
//     .then(() => Migrations.deployed())
//     .then(instance => {
//       console.log("DAO deployed at address: " + instance.address);
//     });
// };
