const { ethers, BigNumber, Contract } = require("ethers");
const bip39 = require("bip39-buffer");
const Dexie = require("dexie");
const networks = require("./networks.json");
const ERC20 = require("./ERC20ABI.json");
const ERC721 = require("./ERC721ABI.json");

const crypto = require("crypto-js");

export const generatePasswordHash = async (password) => {
  try {
    const pwdHash = crypto.SHA256(password).toString(crypto.enc.Hex);
    return pwdHash;
  } catch (error) {
    console.log(error);
  }
};

export const generatemnemonic = async () => {
  try {
    const mnemonic = bip39.generateMnemonic();
    return mnemonic;
  } catch (error) {
    throw new Error(error);
  }
};
export const validatemnemonic = async (mnemonic) => {
  try {
    const isValid = bip39.validateMnemonic(mnemonic);
    return isValid;
  } catch (error) {
    throw new Error(error);
  }
};

export const generateNewWallet = async (mnemonic, accountindex) => {
  try {
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const account = hdNode.derivePath("m/44'/60'/0'/0/" + accountindex);

    const wallets = [];

    for (const chainId in networks) {
      const provider = new ethers.providers.JsonRpcProvider(
        networks[chainId].rpcUrl
      );
      const wallet = new ethers.Wallet(account.privateKey, provider);

      wallets.push({
        network: networks[chainId],
        accountName: [`Default Account`],
        address: [wallet.address],
        privateKey: [account.privateKey],
        ERC20tokens: [[]],
        ERC721tokens: [[]],
        txActivity: [[]],
      });
    }

    return wallets;
  } catch (error) {
    throw new Error(error);
  }
};

export const importWallet = async (mnemonic) => {
  const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
  const account = hdNode.derivePath("m/44'/60'/0'/0");

  const wallets = [];

  for (const chainId in networks) {
    const provider = new ethers.providers.JsonRpcProvider(
      networks[chainId].rpcUrl
    );
    const wallet = new ethers.Wallet(account.privateKey, provider);

    wallets.push({
      network: networks[chainId],
      address: wallet.address,
      privateKey: account.privateKey,
    });
  }

  return wallets;
};

export const generateNewAccount = async (mnemonic,rpcUrl,accountname,accountindex) => {
  try {
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const account = hdNode.derivePath("m/44'/60'/0'/0/"+accountindex);
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(account.privateKey, provider);
    return {
      accountName:accountname,
      address: wallet.address,
      privateKey: wallet.privateKey,
      ERC20tokens:[],
      ERC721tokens:[],
      txActivity:[]
    };
  } catch (error) {
    throw new Error(error);
  }
};


export const getExistingWallet = async (privateKey, chainId, walletAddress) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      networks[chainId].rpcUrl
    );
    const wallet = new ethers.Wallet(privateKey, provider);

    if (wallet.address.toLowerCase() === walletAddress.toLowerCase()) {
      return {
        privateKey: wallet.privateKey,
        address: wallet.address,
        network: networks[chainId],
      };
    } else {
      console.error(
        "Provided private key does not match the specified wallet address."
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentNonce = async (rpcUrl,walletAddress) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const nonce = await provider.getTransactionCount(walletAddress);
    return nonce;
  } catch (error) {
    throw new Error(error);
  }
};


export const getBalance = async (rpcUrl,address) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);   
    const balance = await provider.getBalance(address);

    const balanceEther = ethers.utils.formatEther(
      BigNumber.from(balance._hex).toString()
    );
    const formattedBalance = parseFloat(balanceEther).toFixed(4);

    return formattedBalance;
  } catch (error) {
    throw new Error(error);
  }
};


export const estimateGas = async (address,privateKey,recipientAddress,amount,symbol,chainId,rpcUrl) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const nonce = await provider.getTransactionCount(address);
    const gasPrice = await provider.getGasPrice();
    const gasLimit = 21000 || 45000; 
   const txobject = {
      to: recipientAddress,
      value: ethers.utils.parseEther(amount.toString()),
      gasLimit: BigNumber.from(gasLimit),
      gasPrice: gasPrice,
      nonce: nonce,
      chainId: chainId,
    };
    
    const wallet = new ethers.Wallet(privateKey, provider);

    const gasValue = await wallet.estimateGas(txobject);

    return ethers.utils.formatUnits(gasValue.toString(), "gwei");
  } catch (error) {
   
    throw new Error(error);
  }
};

export const transferFunds = async ( 
  privateKey,
  recipientAddress,
  amount,
  symbol,
  chainId,
  rpcUrl
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const senderWallet = new ethers.Wallet(privateKey);
    const nonce = await provider.getTransactionCount(senderWallet.address);
    const currentBalance = await getBalance(rpcUrl, senderWallet.address);
    const gasPrice = await provider.getGasPrice();
    const gasLimit = 21000; 
    const account = {address:senderWallet.address,privateKey}
    const date =new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", format: "yyyy-MM-ddTHH:mm:ssZ" });
    const transaction = {
      to: recipientAddress,
      value: ethers.utils.parseEther(amount.toString()),
      gasLimit: BigNumber.from(gasLimit),
      gasPrice: gasPrice,
      nonce: nonce,
      chainId: chainId,
    };
    const wallet = new ethers.Wallet(privateKey, provider);
    let gasValue = await wallet.estimateGas(transaction);
    gasValue = ethers.utils.formatUnits(gasValue.toString(), "gwei");
    if ((amount+gasValue) > currentBalance) {
      return {Send:"Send", Date:date,Amount:amount,status:"Failed Due to Insuffiecient Balance"};
    }
   
    const signedTransaction = await senderWallet.signTransaction(transaction);
    const transactionResponse = await provider.sendTransaction(
      signedTransaction
    );
    const receipt = await transactionResponse.wait();
    
    return { Send:"Send",Date:date,txreceipt:{
      Sender: senderWallet.address,
      Recipient: recipientAddress,
      Amount: amount,
      BlockHash: receipt.blockHash,
      TxHash: receipt.transactionHash,
      BlockNumber: receipt.blockNumber,
      TransactionIndex: receipt.transactionIndex,
      GasUsed: receipt.gasUsed.toString(),
    },status: receipt.status === 1 ? "Success" : "Failed",
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const getTokenDetails = async (tokenaddress,rpcUrl) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",
      "function transfer(address to, uint amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 value)  returns (bool)",
      "function transferFrom(address from, address to, uint256 value)  returns (bool)",
      "event Transfer(address indexed from, address indexed to, uint amount)"
  ];
  const erc20 = new Contract(tokenaddress,abi,provider);
  const symbol = await erc20.symbol();
  const decimals = await erc20.decimals();
    return {symbol,decimals};
  } catch (error) {
    throw new Error(error);
  }
};

export const BalanceOfERC20Tokens = async (tokenaddress, useraddress, rpcUrl) => {
  try {
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",
      "function transfer(address to, uint amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 value)  returns (bool)",
      "function transferFrom(address from, address to, uint256 value)  returns (bool)",
      "event Transfer(address indexed from, address indexed to, uint amount)"
    ];
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const erc20 = new Contract(tokenaddress, abi, provider);
    let balanceOfOwner = await erc20.balanceOf(useraddress);
    const decimals = await erc20.decimals();
    const symbol = await erc20.symbol();
    
    // Calculate the balance in a human-readable format
    const balanceInWei = balanceOfOwner; // The balance is in wei
    const balance = parseFloat(ethers.utils.formatUnits(balanceInWei, decimals));
    
    return { balance, symbol };
  } catch (error) {
    console.error("Error:", error.message);
  }
};


export const getExistingAccount = async (accountname,privateKey,rpcUrl) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    if(wallet){
      return {
        accountName:accountname,
        address: wallet.address,
        privateKey: wallet.privateKey,
        ERC20tokens:[],
      ERC721tokens:[],
      txActivity:[]
      };
    } else {
      console.error(
        "Provided private key does not match the specified wallet address."
      );
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const addNetwork = async (chainId, rpcUrl, networkName, symbol) => {
  try {
    if (networks[chainId]) {
      throw new Error(`Network with chainId ${chainId} already exists.`);
    }

    networks[chainId] = { chainId, network: networkName, symbol, rpcUrl };
    return true;
  } catch (error) {
    console.error("Error:", error.message);
  }
};
export const generateWalletNewNetwork = async (mnemonic, rpcUrl) => {
  try {
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
    const account = hdNode.derivePath("m/44'/60'/0'/0/0");
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(account.privateKey, provider);
    return {
      accountName: ["Default Account"],
      address: [wallet.address],
      privateKey: [wallet.privateKey],
      ERC20tokens: [[]],
      ERC721tokens: [[]],
      txActivity: [[]],
    };
  } catch (error) {
    throw new Error(error);
  }
};



const deployContract = async (
  privateKey,
  contractBytecode,
  gasLimit,
  gasPrice,
  chainId,
  constructorArgs
) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      networks[chainId].rpcUrl
    );
    const wallet = new ethers.Wallet(privateKey, provider);

    const factory = new ethers.ContractFactory([], contractBytecode, wallet);
    const contract = await factory.deploy(...constructorArgs, {
      gasLimit: ethers.BigNumber.from(gasLimit),
      gasPrice: ethers.utils.parseUnits(gasPrice.toString(), "gwei"),
    });

    const transactionReceipt = await contract.deployed();

    return {
      contractAddress: transactionReceipt.address,
      transactionHash: transactionReceipt.deployTransaction.hash,
    };
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
};

const verifyTransaction = async (transactionHash, chainId) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      networks[chainId].rpcUrl
    );
    const transaction = await provider.getTransaction(transactionHash);
    if (!transaction) {
      return false;
    }

    const block = await provider.getBlock(transaction.blockNumber);
    if (!block) {
      return false;
    }

    const transactionIndex = transaction.transactionIndex;
    const receipt = await provider.getTransactionReceipt(transactionHash);
    if (!receipt) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const backupAccountKeystore = async (privateKey, password, rpcUrl) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const keystore = await wallet.encrypt(password);
    return keystore;
  } catch (error) {
    throw new Error(error);
  }
};

// const recoverAccountKeystore = async (keystore, password, chainId) => {
//   try {
//     const provider = new ethers.providers.JsonRpcProvider(
//       networks[chainId].rpcUrl
//     );
//     const keystoreFile = fs.readFileSync(keystore, "utf8");
//     const keystoreData = JSON.parse(keystoreFile);
//     const recoveredWallet = await ethers.Wallet.fromEncryptedJson(
//       keystoreData,
//       password
//     );
//     return {
//       walletAddress: recoveredWallet.address,
//       privateKey: recoveredWallet.privateKey,
//       network: await recoveredWallet.connect(provider).getChainId(),
//     };
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// };


export const importERC20Tokens = async (tokenaddress,useraddress,tokensymbol,tokenDecimals,rpcUrl) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const erc20 = new Contract(tokenaddress, ERC20, provider);
    let balanceOfOwner = await erc20.balanceOf(useraddress);
    const balance = ethers.utils.formatUnits(
      BigNumber.from(balanceOfOwner._hex).toString(),
      tokenDecimals
    );
    
    return  {balance:parseFloat(balance),tokensymbol};
  } catch (error) {
    console.error("Error:", error.message);
  }
};

export const BalanceOfERC721Tokens = async (tokenaddress,useraddress,rpcUrl) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const erc721 = new Contract(tokenaddress, ERC721, provider);
    let balanceOfOwner = await erc721.balanceOf(useraddress);
    return  {balance:balanceOfOwner.toNumber()};
  } catch (error) {
    console.error("Error:", error.message);
  }
};


export const impotERC721Tokens = async (tokenaddress,useraddress, rpcUrl) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const erc721 = new Contract(tokenaddress, ERC721, provider);
    let balanceOfOwner = await erc721.balanceOf(useraddress);
    return { balance: balanceOfOwner };
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const txactivity = async (address, chainId) => {
  const provider = new ethers.providers.JsonRpcProvider(
    networks[chainId].rpcUrl
  );
  let txactivity = [];
  const blocknumber = await provider.getBlockNumber();
  provider.on("block", async () => {
    const block = await provider.getBlockWithTransactions(blocknumber);
    const transactions = block.transactions;
    const filteredTransactions = transactions.filter((transaction) => {
      return transaction.to.toLowerCase() === address;
    });
    txactivity.push({ tx: filteredTransactions, time: Date.now() });
  });

  return txactivity;
};


export const transferERC20Tokens = async (
  privateKey,
  recipientAddress,
  amount,
  tokenAddress,
  rpcUrl
) => {
  try {
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",
      "function transfer(address to, uint amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",
      "function approve(address spender, uint256 value)  returns (bool)",
      "function transferFrom(address from, address to, uint256 value)  returns (bool)",
      "event Transfer(address indexed from, address indexed to, uint amount)"
  ];
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", format: "yyyy-MM-ddTHH:mm:ssZ" });
    const senderWallet = new ethers.Wallet(privateKey,provider);
    let nonce = await provider.getTransactionCount(senderWallet.address);
    let currentBalance = await provider.getBalance(senderWallet.address);
    const gasPrice = await provider.getGasPrice();
     if (tokenAddress) {
      
      const erc20 = new Contract(tokenAddress,abi,senderWallet);
      const decimals = await erc20.decimals();
      let allowance = await erc20.allowance(senderWallet.address, recipientAddress);
      allowance = ethers.utils.parseUnits(allowance.toString(), decimals);
      amount = ethers.utils.parseUnits(amount.toString(),decimals);
      if (allowance <= amount) {
        let approveestimatedGas = await erc20.estimateGas.approve(recipientAddress, amount);
        const approvegasLimit = approveestimatedGas.mul(110).div(100) 
        if (approveestimatedGas > currentBalance) {
          return { Send:"Send",Date:date,status:"Failed Due to Insuffiecient Balance"};
        }
        const approveres = await erc20.approve(recipientAddress,amount,{gasLimit:approvegasLimit,gasPrice});
        const approvetx = await approveres.wait();
        console.log(approvetx);
        nonce++;
      }
      let tokenbalance = await erc20.balanceOf(senderWallet.address);
      tokenbalance = ethers.utils.parseUnits(tokenbalance.toString(),decimals)
      if(tokenbalance > amount){
        let transferestimatedGas = await erc20.estimateGas.transfer(recipientAddress, amount);
        const transfergasLimit = transferestimatedGas.mul(110).div(100);
        if (transferestimatedGas > currentBalance ) {
          return { Send:"Send",Date:date,status:"Failed Due to Insuffiecient Balance"};
        }
        const transferres = await erc20.transfer(recipientAddress,amount,{gasLimit:transfergasLimit,gasPrice});
        const receipt = await transferres.wait();
       
        console.log({Send:"Send",Date:date,txreciept:{Sender: senderWallet.address,
          Recipient: recipientAddress,
          Amount: amount,
          BlockHash: receipt.blockHash,
          TxHash: receipt.transactionHash,
          BlockNumber: receipt.blockNumber,
          TransactionIndex: receipt.transactionIndex,
          GasUsed: receipt.gasUsed.toString(),
        },status:receipt.status === 1 ? "Success" : "Failed"});
        return {Send:"Send",Date:date,txreciept:{
          Sender: senderWallet.address,
          Recipient: recipientAddress,
          Amount: amount,
          BlockHash: receipt.blockHash,
          TxHash: receipt.transactionHash,
          BlockNumber: receipt.blockNumber,
          TransactionIndex: receipt.transactionIndex,
          GasUsed: receipt.gasUsed.toString(),
        },status: receipt.status === 1 ? "Success" : "Failed"};
      }else{
        return { Send:"Send",Date:date,status:"Failed Due to Insuffiecient Token Balance"};
      }  
    } 
   
  } catch (error) {
    throw new Error(error);
  }
};
