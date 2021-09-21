import { ethers } from "./ethers-5.1.esm.min.js";

let userAddress;
let balance;
let network;
let signInBtn = document.querySelector('#sign-in-btn');
let accountInfo = document.querySelector('#account-info');
let verifyBtn = document.querySelector('#verify-btn');
let avatar = document.querySelector('#name');
let profile = document.querySelector('#profile');
let provider;

try {
  // A Web3Provider wraps a standard Web3 provider, which is
  // what Metamask injects as window.ethereum into each page
  provider = new ethers.providers.Web3Provider(window.ethereum)
}
catch {
  // non web3 browser, warn user
  signInBtn.parentNode.replaceChild(
    document.createTextNode('Non Web3 browser detected. Please install MetaMask or upgrade your browser.'),
    signInBtn
  );
}

/**
 * Prompts user to connect page with Metamask.
 * TODO maybe prefer provider.request({ method: 'eth_requestAccounts', params: ... })
 * https://eips.ethereum.org/EIPS/eip-1193#request
 * https://docs.ethers.io/v5/api/providers/other/#Web3Provider--ExternalProvider
 * TODO maybe replace toplevel then/catch with optimistic refresh
 * https://docs.ethers.io/v5/concepts/best-practices/#best-practices
 */
let signInWithEthereum = async () => {
  provider.send("eth_requestAccounts", [])
  .then(async () => {  
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
    verifyBtn.style.display = 'block';
  })
  .catch(err => {
    // Developer probably changed metamask, prompt to refresh
    signInBtn.parentNode.replaceChild(
      document.createTextNode('Changing MetaMask Networks breaks web3 pages. For best security refresh the page.'),
      signInBtn
    );
  });
}
signInBtn.addEventListener('click', signInWithEthereum);


/**
 * Prompts user to sign a message. This verifies that the address on window.ethereum
 * is owned by the person that has the private key.
 */
 let signMessage = async () => {
   console.log('todo')
}
verifyBtn.addEventListener('click', signMessage);

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
      View Account on Etherscan
      </a>
    </div>
  `);
  displayAvatar();
}

/**
 * Updates Avatar in upper right hand corner with the current user.
 */
let displayAvatar = () => {
  let truncAddress = `${userAddress.slice(0, 6)}...${userAddress.slice(38)}`;
  avatar.innerText = truncAddress;
  profile.href = `https://${
    network === 'homestead' ? '' : network+'.'
  }etherscan.io/address/${userAddress}`;
}

/**
 * Prompts user to sign a message. This proves that the detected address is owned
 * by the person that has the private key.
 * TODO https://docs.ethers.io/v5/api/signer/#Signer-signMessage
 */