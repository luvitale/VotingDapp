// Import needed libraries
import Web3 from 'web3'
//import { default as contract } from 'truffle-contract'

import votingArtifacts from '../../build/contracts/Voting.json'

//var Voting = contract(voting_artifacts);

let candidates = {"Satoshi": "candidate-1", "Vitalik": "candidate-2"}

const App = {
  web3: null,
  account: null,
  voting: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = votingArtifacts.networks[networkId];
      this.voting = new web3.eth.Contract(
        votingArtifacts.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },
    
  getVotes: async function() {
	  let candidatesName = Object.keys(candidates);
	  
	  for (var i = 0; i < candidatesName.length; i++) {
		let name = candidatesName[i];
		const { totalVotes } = this.voting.methods;
		const votes = await totalVotes(this.web3.utils.asciiToHex(name)).call()
		document.getElementById(candidates[name]).innerHTML = votes.toString();
	  }
  },
  
  voteCandidate: async function() {
	  let candidateName = document.getElementById("candidate").value;

	  try {
		document.getElementById("msg").innerHTML = "Your vote has been emitted. The number of votes will be updated when the transaction is mined. Please wait";
		document.getElementById("candidate").value = "";

	    const { vote } = this.voting.methods;
		await vote(this.web3.utils.asciiToHex(candidateName)).send({from: this.account});
		let div_id = candidates[candidateName];
		
		this.getVotes();
		document.getElementById("msg").innerHTML = "";
	  } catch (err) {
		  console.log(err);
	  }
  },
};

window.app = App;

// When the page loads, the conection with the blockchain starts and the votes of candidates are updated
window.onload = loadPage;

async function loadPage() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 of external source as Metamask")
    App.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Redirect to http://localhost:7545");
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }
  
  await App.start();
  
  await App.getVotes();
  
  document.getElementById("btn-vote").addEventListener("click", async function() {
	  await App.voteCandidate();
  });
};