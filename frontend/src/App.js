import React, { useState } from 'react';
const ethers = require("ethers")


function App() {
  const [itemURI, setItemURI] = useState('');
  const contractAddress = '0x6b71D8eAB17a1F673aA03269b3aeEA47F1C01074';
  const contractABI = [
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
            "name": "itemId",
            "type": "uint256"
          }
        ],
        "name": "getItem",
        "outputs": [
          {
            "components": [
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
            "internalType": "struct MetaCollection.Item",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
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
  ];
  const [searchId, setSearchId] = useState('');
  const [foundItem, setFoundItem] = useState(null);
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  async function fetchItem() {
    if (!searchId.trim()) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      try {
        const item = await contract.getItem(searchId);
        setFoundItem({
          id: searchId,
          owner: item.owner,
          URI: item.URI,
        });
      } catch (err) {
        console.error('Error fetching item:', err);
        setFoundItem(null);
      }
    }
  }
  async function mint() {
    if (!itemURI) return alert('Please enter a URI');
    if (window.ethereum) {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      try {
        const transaction = await contract.mint(itemURI);
        await transaction.wait();
        alert('NFT minted successfully!');
        setItemURI('');
      } catch (err) {
        console.error('Error:', err);
        alert('An error occurred!');
      }
    } else {
      alert('MetaMask is not installed!');
    }
  }

  return (
    <div className="App">
      <input
        type="text"
        value={itemURI}
        onChange={(e) => setItemURI(e.target.value)}
        placeholder="Enter Item URI"
      />
      <button onClick={mint}>Mint NFT</button>
      <div>
        <input
          placeholder="Enter Item ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={() => fetchItem()}>Search Item</button>
      </div>

      {/* Отображение найденного элемента */}
      {foundItem && (
        <div>
          <p>ID: {foundItem.id}</p>
          <p>Owner: {foundItem.owner}</p>
          <p>URI: {foundItem.URI}</p>
        </div>
      )}
    </div>
    
  );
}

export default App; 