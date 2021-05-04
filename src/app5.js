var web3Provider = null;
var secondOpinion;
const nullAddress = "0x0000000000000000000000000000000000000000";

function init() {
  // We init web3 so we have access to the blockchain
  initWeb3();
}

function initWeb3() {
  if (typeof web3 !== 'undefined' && typeof web3.currentProvider !== 'undefined') {
    web3Provider = web3.currentProvider;
    web3 = new Web3(web3Provider);
  } else {    
    console.error('No web3 provider found. Please install Metamask on your browser.');
    alert('No web3 provider found. Please install Metamask on your browser.');
  }
  
  // Alignment of code with the updated Metamask Privacy Policy
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
  try { 
    window.ethereum.enable().then(function() {
        // User has allowed account access to DApp...
    });
    } catch(e) {
    // User has denied account access to DApp...
    }
  }
  // Legacy DApp Browsers
  else if (window.web3) {
    web3 = new Web3(web3.currentProvider);
  }
  // Non-DApp Browsers
    else {
    alert('You have to install MetaMask !');
    }
    // END OF Alignment

  // we init the cryptoLawyers contract infos so we can interact with it
  initContract();
}


function initContract() {
  secondOpinion.deployed().then(function(instance) {
  $.getJSON('secondOpinion.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    secondOpinion = TruffleContract(data);

    // Set the provider for our contract
    secondOpinion.setProvider(web3Provider);

    // listen to the events emitted by our smart contract
    getEvents ();

    // We'll retrieve the Lawyers addresses set in our contract using Web3.js
    getFirstlawyerAddress();
    getSecondlawyerAddress();
  });
}

function getEvents() {
  secondOpinion.deployed().then(function(instance) {
  var events = instance.allEvents(function(error, log){
    if (!error)
      $("#eventsList").prepend('<li>' + log.event + '</li>'); // Using JQuery, we will add new events to a list in our index.html
  });
  }).catch(function(err) {
    console.log(err.message);
  });
}

function getFirstlawyerAddress() {
  secondOpinion.deployed().then(function(instance) {
    return instance.lawyer1.call();
  }).then(function(result) {
    $("#lawyer1").text(result); // Using JQuery again, we will modify the html tag with id lawyer1 with the returned text from our call on the instance of the wrestling contract we deployed
  }).catch(function(err) {
    console.log(err.message);
  });
}

function getSecondlawyerAddress() {
  secondOpinion.deployed().then(function(instance) {
    return instance.lawyer2.call();
  }).then(function(result) {
    if(result != nullAddress) {
      $("#lawyer2").text(result);
      $("#register").remove(); // By clicking on the button with the ID registerToAssess2, a user can register as second lawyer, so we need to remove the button if a second lawyer is set 
    } else {
      $("#lawyer2").text("Undecided, you can register to assess the request for legal help!");
    }   
  }).catch(function(err) {
    console.log(err.message);
  });
}


function registerAsSecondlawyer() {
  web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  } else {
    if(accounts.length <= 0) {
      alert("No account is unlocked, please authorize an account on Metamask.")
    } else {
      secondOpinion.deployed().then(function(instance) {
        return instance.registerAsAnOpponent({from: accounts[0]});
      }).then(function(result) {
        console.log('Registered as an opponent')
        getSecondlawyerAddress();
      }).catch(function(err) {
        console.log(err.message);
      });
    }
  }
  });
}


// When the page loads, this will call the init() function
$(function() {
  $(window).load(function() {
    init();
  });
});