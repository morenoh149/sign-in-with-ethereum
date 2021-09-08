import { ethers } from "./ethers-5.1.esm.min.js";
// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum)

let userAddress;
let balance;
let network;
let signInBtn = document.querySelector('#sign-in-btn');
let accountInfo = document.querySelector('#account-info');

/**
 * Prompts user to connect page with Metamask.
 */
let signInWithEthereum = async () => {
  await provider.send("eth_requestAccounts", []);
  
  // The Metamask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = await provider.getSigner()

  userAddress = await signer.getAddress()
  balance = await provider.getBalance(userAddress)
  balance = ethers.utils.formatEther(balance);
  network = provider.network.name;
  signInBtn.remove();
  displayAccountInformation();
}

/**
 * Displays User's information on the page.
 */
let displayAccountInformation = () => {
  accountInfo.insertAdjacentHTML('beforeend', `
    <div>Address: ${userAddress}</div>
    <div>Current Network: ${network}</div>
    <div>Balance: ${balance} ETH</div>
    <div>
      <a href="https://${
        network === 'homestead' ? '' : network+'.'
      }etherscan.io/address/${userAddress}">
      View on Etherscan
      </a>
    </div>
  `);
}
signInBtn.addEventListener('click', signInWithEthereum);