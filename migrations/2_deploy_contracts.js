const SecondOpinionContract = artifacts.require("SecondOpinion");

module.exports = function(deployer) {
	deployer.deploy(SecondOpinionContract);
};