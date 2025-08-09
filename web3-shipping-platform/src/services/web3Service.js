import { ethers } from 'ethers';
import Web3 from 'web3';

// Smart contract ABI for shipping platform
const SHIPPING_CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "shipmentId", "type": "string"},
      {"internalType": "address", "name": "sender", "type": "address"},
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "uint256", "name": "value", "type": "uint256"}
    ],
    "name": "createShipment",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "shipmentId", "type": "string"},
      {"internalType": "uint8", "name": "status", "type": "uint8"}
    ],
    "name": "updateShipmentStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "shipmentId", "type": "string"}],
    "name": "getShipment",
    "outputs": [
      {"internalType": "address", "name": "sender", "type": "address"},
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "uint256", "name": "value", "type": "uint256"},
      {"internalType": "uint8", "name": "status", "type": "uint8"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "shipmentId", "type": "string"}],
    "name": "confirmDelivery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "string", "name": "shipmentId", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "sender", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "value", "type": "uint256"}
    ],
    "name": "ShipmentCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "string", "name": "shipmentId", "type": "string"},
      {"indexed": false, "internalType": "uint8", "name": "status", "type": "uint8"}
    ],
    "name": "ShipmentStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "string", "name": "shipmentId", "type": "string"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"}
    ],
    "name": "DeliveryConfirmed",
    "type": "event"
  }
];

// Shipping status enum
const SHIPMENT_STATUS = {
  CREATED: 0,
  PICKUP_SCHEDULED: 1,
  PICKED_UP: 2,
  IN_TRANSIT: 3,
  OUT_FOR_DELIVERY: 4,
  DELIVERED: 5,
  FAILED: 6,
  RETURNED: 7,
  CANCELLED: 8
};

class Web3Service {
  constructor() {
    this.web3 = null;
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
    this.chainId = null;
    
    // Contract address (demo address for testing)
    this.contractAddress = process.env.REACT_APP_SHIPPING_CONTRACT_ADDRESS || '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b5';
    
    // Supported networks
    this.networks = {
      1: { name: 'Ethereum Mainnet', rpc: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY' },
      5: { name: 'Goerli Testnet', rpc: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY' },
      11155111: { name: 'Sepolia Testnet', rpc: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY' },
      137: { name: 'Polygon Mainnet', rpc: 'https://polygon-rpc.com' },
      80001: { name: 'Polygon Mumbai', rpc: 'https://rpc-mumbai.maticvigil.com' },
      1337: { name: 'Local Ganache', rpc: 'http://localhost:8545' }
    };
  }

  async init() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.web3 = new Web3(window.ethereum);
        
        // Get network info
        const network = await this.provider.getNetwork();
        this.chainId = Number(network.chainId);
        
        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          this.account = accounts[0];
          this.signer = await this.provider.getSigner();
          await this.initContract();
        }
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
        window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
        
        return true;
      } else {
        console.warn('MetaMask not detected');
        return false;
      }
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      return false;
    }
  }

  async connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        this.account = accounts[0];
        this.signer = await this.provider.getSigner();
        await this.initContract();
        return this.account;
      } else {
        throw new Error('No accounts found');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async initContract() {
    if (this.signer && this.contractAddress) {
      this.contract = new ethers.Contract(
        this.contractAddress,
        SHIPPING_CONTRACT_ABI,
        this.signer
      );
    }
  }

  async switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        const network = this.networks[chainId];
        if (network) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: network.name,
              rpcUrls: [network.rpc],
            }],
          });
        }
      }
      throw switchError;
    }
  }

  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.account = null;
      this.signer = null;
      this.contract = null;
    } else {
      this.account = accounts[0];
      this.initializeAfterAccountChange();
    }
  }

  async initializeAfterAccountChange() {
    try {
      this.signer = await this.provider.getSigner();
      await this.initContract();
    } catch (error) {
      console.error('Failed to reinitialize after account change:', error);
    }
  }

  handleChainChanged(chainId) {
    this.chainId = parseInt(chainId, 16);
    // Reload the page to reset the dapp state
    window.location.reload();
  }

  // Shipment management on blockchain
  async createShipmentOnChain(shipmentId, recipientAddress, value) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const valueInWei = ethers.parseEther(value.toString());
      
      const tx = await this.contract.createShipment(
        shipmentId,
        this.account,
        recipientAddress,
        valueInWei,
        { value: valueInWei }
      );

      const receipt = await tx.wait();
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to create shipment on chain:', error);
      throw error;
    }
  }

  async updateShipmentStatusOnChain(shipmentId, status) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const statusCode = SHIPMENT_STATUS[status] || 0;
      
      const tx = await this.contract.updateShipmentStatus(shipmentId, statusCode);
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to update shipment status on chain:', error);
      throw error;
    }
  }

  async getShipmentFromChain(shipmentId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const result = await this.contract.getShipment(shipmentId);
      
      return {
        sender: result[0],
        recipient: result[1],
        value: ethers.formatEther(result[2]),
        status: Object.keys(SHIPMENT_STATUS)[result[3]],
        timestamp: new Date(Number(result[4]) * 1000)
      };
    } catch (error) {
      console.error('Failed to get shipment from chain:', error);
      throw error;
    }
  }

  async confirmDeliveryOnChain(shipmentId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await this.contract.confirmDelivery(shipmentId);
      const receipt = await tx.wait();
      
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to confirm delivery on chain:', error);
      throw error;
    }
  }

  // Event listening
  async listenToShipmentEvents(callback) {
    if (!this.contract) return;

    // Listen for ShipmentCreated events
    this.contract.on('ShipmentCreated', (shipmentId, sender, recipient, value, event) => {
      callback({
        type: 'ShipmentCreated',
        shipmentId,
        sender,
        recipient,
        value: ethers.formatEther(value),
        transactionHash: event.log.transactionHash
      });
    });

    // Listen for ShipmentStatusUpdated events
    this.contract.on('ShipmentStatusUpdated', (shipmentId, status, event) => {
      callback({
        type: 'ShipmentStatusUpdated',
        shipmentId,
        status: Object.keys(SHIPMENT_STATUS)[status],
        transactionHash: event.log.transactionHash
      });
    });

    // Listen for DeliveryConfirmed events
    this.contract.on('DeliveryConfirmed', (shipmentId, recipient, event) => {
      callback({
        type: 'DeliveryConfirmed',
        shipmentId,
        recipient,
        transactionHash: event.log.transactionHash
      });
    });
  }

  // Utility methods
  async getBalance(address = null) {
    const targetAddress = address || this.account;
    if (!targetAddress) return '0';
    
    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  async getGasPrice() {
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice;
  }

  async estimateGas(transaction) {
    return await this.provider.estimateGas(transaction);
  }

  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  isValidAddress(address) {
    return ethers.isAddress(address);
  }

  // Payment methods
  async sendPayment(to, amount) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      const tx = await this.signer.sendTransaction({
        to,
        value: ethers.parseEther(amount.toString())
      });

      const receipt = await tx.wait();
      return {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Failed to send payment:', error);
      throw error;
    }
  }

  // Network info
  getNetworkName() {
    return this.networks[this.chainId]?.name || 'Unknown Network';
  }

  isConnected() {
    return !!this.account;
  }

  getAccount() {
    return this.account;
  }

  getChainId() {
    return this.chainId;
  }

  // Demo functions for testing without actual smart contract
  async createDemoShipment(shipmentData) {
    // Simulate blockchain transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          blockNumber: Math.floor(Math.random() * 1000000),
          gasUsed: '21000',
          shipmentId: shipmentData.id,
          status: 'CREATED'
        });
      }, 2000);
    });
  }

  async updateDemoShipmentStatus(shipmentId, status) {
    // Simulate blockchain transaction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          blockNumber: Math.floor(Math.random() * 1000000),
          gasUsed: '21000',
          shipmentId,
          status
        });
      }, 1500);
    });
  }
}

// Create singleton instance
const web3Service = new Web3Service();

export default web3Service;
export { SHIPMENT_STATUS };

