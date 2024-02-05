import { ethers } from "ethers";

const contractAddress = "0xb9c06221Aa8f545190D54CE6A8C7194395a00799";
const contractABI = [   
    [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "itemURI",
                    "type": "string"
                }
            ],
            "name": "mint",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "items",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "URI",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];

export const mintItem = async (itemURI) => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const metaCollectionContract = new ethers.Contract(contractAddress, contractABI, signer);

      console.log("Minting item...");
      const mintTx = await metaCollectionContract.mint(itemURI);

      await mintTx.wait();
      console.log("Minted:", mintTx.hash);

      return mintTx.hash; 
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.error("Error minting item:", error);
  }
};
