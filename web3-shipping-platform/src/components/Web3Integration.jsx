import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Wallet, 
  Link, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Send, 
  Package,
  TrendingUp,
  Activity,
  DollarSign
} from 'lucide-react';
import web3Service from '../services/web3Service';

const Web3Integration = () => {
  const { t } = useTranslation();
  const [web3Connected, setWeb3Connected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [networkName, setNetworkName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Demo shipment creation
  const [shipmentForm, setShipmentForm] = useState({
    recipientAddress: '',
    value: '',
    description: ''
  });
  const [creatingShipment, setCreatingShipment] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  // Demo stats
  const [stats, setStats] = useState({
    totalShipments: 0,
    totalValue: '0',
    successfulDeliveries: 0
  });

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    try {
      const web3Initialized = await web3Service.init();
      if (web3Initialized && web3Service.isConnected()) {
        setWeb3Connected(true);
        setAccount(web3Service.getAccount());
        setNetworkName(web3Service.getNetworkName());
        const balance = await web3Service.getBalance();
        setBalance(balance);
        
        // Load demo stats from localStorage
        const savedStats = localStorage.getItem('web3ShippingStats');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
      }
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      setError('Failed to initialize Web3 services');
    }
  };

  const connectWeb3 = async () => {
    setLoading(true);
    setError('');
    try {
      const account = await web3Service.connectWallet();
      setWeb3Connected(true);
      setAccount(account);
      setNetworkName(web3Service.getNetworkName());
      const balance = await web3Service.getBalance();
      setBalance(balance);
      setSuccess('Web3 wallet connected successfully!');
      
      // Load demo stats from localStorage
      const savedStats = localStorage.getItem('web3ShippingStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      setError(`Failed to connect Web3 wallet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWeb3 = async () => {
    setWeb3Connected(false);
    setAccount('');
    setBalance('0');
    setNetworkName('');
    setSuccess('Web3 wallet disconnected');
  };

  const createDemoShipment = async () => {
    if (!shipmentForm.recipientAddress || !shipmentForm.value) {
      setError('Please fill in recipient address and value');
      return;
    }

    if (!web3Service.isValidAddress(shipmentForm.recipientAddress)) {
      setError('Invalid recipient address');
      return;
    }

    setCreatingShipment(true);
    setError('');
    
    try {
      const shipmentData = {
        id: `SH${Date.now()}`,
        recipient: shipmentForm.recipientAddress,
        value: shipmentForm.value,
        description: shipmentForm.description
      };

      const result = await web3Service.createDemoShipment(shipmentData);
      
      setLastTransaction(result);
      setSuccess(`Shipment created successfully! Transaction: ${result.transactionHash.slice(0, 10)}...`);
      
      // Update stats
      const newStats = {
        totalShipments: stats.totalShipments + 1,
        totalValue: (parseFloat(stats.totalValue) + parseFloat(shipmentForm.value)).toFixed(4),
        successfulDeliveries: stats.successfulDeliveries
      };
      setStats(newStats);
      localStorage.setItem('web3ShippingStats', JSON.stringify(newStats));
      
      // Reset form
      setShipmentForm({
        recipientAddress: '',
        value: '',
        description: ''
      });
      
    } catch (error) {
      setError(`Failed to create shipment: ${error.message}`);
    } finally {
      setCreatingShipment(false);
    }
  };

  const simulateDelivery = async () => {
    if (!lastTransaction) return;
    
    setLoading(true);
    try {
      const result = await web3Service.updateDemoShipmentStatus(
        lastTransaction.shipmentId, 
        'DELIVERED'
      );
      
      setSuccess(`Delivery confirmed! Transaction: ${result.transactionHash.slice(0, 10)}...`);
      
      // Update delivery stats
      const newStats = {
        ...stats,
        successfulDeliveries: stats.successfulDeliveries + 1
      };
      setStats(newStats);
      localStorage.setItem('web3ShippingStats', JSON.stringify(newStats));
      
    } catch (error) {
      setError(`Failed to confirm delivery: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          {t('web3_integration')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Decentralized shipping platform powered by blockchain technology
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Web3 Connection Status */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            Web3 Wallet Connection
            {web3Connected && (
              <Badge variant="success" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to interact with the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {web3Connected ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account:
                  </p>
                  <p className="font-mono text-sm text-blue-600 dark:text-blue-400">
                    {formatAddress(account)}
                  </p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Network:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {networkName}
                  </p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Balance:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {parseFloat(balance).toFixed(4)} ETH
                  </p>
                </div>
              </div>
              <Button 
                onClick={disconnectWeb3}
                variant="outline"
                className="w-full"
              >
                Disconnect Wallet
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connectWeb3}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Wallet className="h-4 w-4 mr-2" />
              )}
              Connect MetaMask Wallet
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Platform Statistics */}
      {web3Connected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalShipments}</div>
              <p className="text-xs text-muted-foreground">
                Blockchain-verified shipments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalValue} ETH</div>
              <p className="text-xs text-muted-foreground">
                Secured on blockchain
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Deliveries</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successfulDeliveries}</div>
              <p className="text-xs text-muted-foreground">
                Confirmed on-chain
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Shipment Demo */}
      {web3Connected && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-purple-600" />
              Create Blockchain Shipment
            </CardTitle>
            <CardDescription>
              Create a new shipment secured on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b5"
                value={shipmentForm.recipientAddress}
                onChange={(e) => setShipmentForm({
                  ...shipmentForm,
                  recipientAddress: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Shipment Value (ETH)</Label>
              <Input
                id="value"
                type="number"
                step="0.001"
                placeholder="0.01"
                value={shipmentForm.value}
                onChange={(e) => setShipmentForm({
                  ...shipmentForm,
                  value: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Package description..."
                value={shipmentForm.description}
                onChange={(e) => setShipmentForm({
                  ...shipmentForm,
                  description: e.target.value
                })}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={createDemoShipment}
                disabled={creatingShipment}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {creatingShipment ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Create Shipment
              </Button>
              
              {lastTransaction && (
                <Button 
                  onClick={simulateDelivery}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Confirm Delivery
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Last Transaction */}
      {lastTransaction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Latest Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Shipment ID:</span>
                <span className="text-sm font-mono">{lastTransaction.shipmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Transaction Hash:</span>
                <span className="text-sm font-mono text-blue-600">
                  {formatAddress(lastTransaction.transactionHash)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Block Number:</span>
                <span className="text-sm">{lastTransaction.blockNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="success">{lastTransaction.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Features</CardTitle>
          <CardDescription>
            Advanced features powered by Web3 technology
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Immutable Records</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All shipment data is permanently stored on the blockchain
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Smart Contracts</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automated execution of shipping agreements
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Decentralized Payments</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Direct cryptocurrency payments without intermediaries
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Transparent Tracking</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time, verifiable shipment status updates
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Web3Integration;

