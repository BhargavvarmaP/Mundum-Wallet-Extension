import { create } from "zustand";
import { Dexie } from "dexie";
import {exportDB,importDB} from "dexie-export-import";
import {
  generatemnemonic,
  generateNewWallet,
  importWallet,
  generateNewAccount,
  getBalance,
  getCurrentNonce,
  validatemnemonic,
  generatePasswordHash,
  transferFunds,
  importERC20Tokens,
  BalanceOfERC721Tokens,
  BalanceOfERC20Tokens,
  estimateGas,
  getExistingAccount,
  generateWalletNewNetwork,
  impotERC721Tokens,
  backupAccountKeystore,
  getTokenDetails,
  transferERC20Tokens,
} from "../utils/Wallet";
import {NON_INDEXED_FIELDS,applyEncryptionMiddleware} from "dexie-encrypted";

const encryptionKey = new Uint8Array([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
]);

const db = new Dexie("MundumWallet");
applyEncryptionMiddleware(db,encryptionKey,{
  userdetails:NON_INDEXED_FIELDS,
  userwallets:NON_INDEXED_FIELDS,
})

db.version(2).stores({
  userdetails: "++id",
  userwallets: "++id",
});

// Define a store to manage the state using the "create" function from "zustand".
const userStore = create((set, get) => ({
  isAuthenticated: false,
  hadwallet: false,
  password: "",
  mnemonicArray: [],
  accountindex: [],
  wallets: [],
  networks: [],

    // Async function to retrieve the password from the Dexie database.
  getpassword: async () => {
    const userdetails = await db.userdetails.toArray();
    return userdetails[1].Password[0];
  },

  // Async function to retrieve the mnemonic from the Dexie database and join it into a space-separated string.
  getmnemonic: async () => {
    const userdetails = await db.userdetails.toArray();
    const mnemonicarray = userdetails.map((user) => user.mnemonicArray);
    return mnemonicarray.join(" ");
  },

   // Async function to retrieve the wallets from the Dexie database.
  getwallets: async () => {
    const userwallet = await db.userwallets.toArray();
    return userwallet[0].wallets;
  },

   // Async function to retrieve the networks from the Dexie database.
  getnetworks: async () => {
    const userwallet = await db.userwallets.toArray();
    return userwallet[1].networks;
  },

  // Async function to retrieve the accounts from the Dexie database by flattening the nested structure.
  getaccounts: async () => {
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const accounts = wallets.flatMap((wallet) => {
      return wallet.accountName.map((accountName, i) => ({
        accountName,
        address: wallet.address[i],
        network: wallet.network,
        privatekey: wallet.privateKey[i],
      }));
    });
    return accounts;
  },

  // Async function to generate a password hash and store it in the database.
  generatePassword: async (pwd) => {
    if (!((await get().password) === "")) {
      console.error(
        "Wallet already exists not able to generate password again"
      );
    }
    await db.open();
    const pwdHash = await generatePasswordHash(pwd);
    set((state) => ({
      password: [pwdHash, ...state.password],
    }));
    const result = await db.userdetails.add({ Password: await get().password });
    return result;
  },

   // Async function to generate a mnemonic and store it in the database.
  generateMnemonic: async () => {
    if ((await get().password) === "") {
      console.error("Password must be created before generating mnemonic");
    }
    const mnemonic = await generatemnemonic();
    const words = mnemonic.split(" ");
    const mnemonicCodes = [];
    words.forEach((word) => {
      mnemonicCodes.push(word);
    });
    set(()=>({
      mnemonicArray: [mnemonicCodes],
    }));
    const result = await db.userdetails.add({
      mnemonicArray: await get().mnemonicArray,
    });

    return { result };
  },

  // Async function to generate a new wallet based on a provided mnemonic code.
  generateNewWallet: async (mnemonicCode) => {
     // Check if a password exists before generating a new wallet.
    if ((await get().password) === null) {
      console.error("Password must be created before generating newwallet");
    }
     // Retrieve the true mnemonic from the state and compare it with the user-provided mnemonic code.
    const TrueMnemonic = (await get().mnemonicArray[0]).join(" ");
    const userMnemonic = mnemonicCode;
    
    if (!(userMnemonic === TrueMnemonic)) {
      alert("Mnemonic is not Matched");
    }
     // Generate a new wallet, retrieve the network information, and update the state accordingly.
    const wallet = await generateNewWallet(
      userMnemonic,
      await get().accountindex.length
    );
    const network = wallet.map((network) => {
      return network.network;
    });

    const index = await get().accountindex;
    set(() => ({
      wallets: [wallet],
      networks: [network],
      accountindex: [index.push(1)],
    }));

     // Store the updated wallet, network, and account index in the Dexie database.
    const result1 = await db.userwallets.add({ wallets: await get().wallets });
    const result2 = await db.userwallets.add({networks: await get().networks});
    const result3 = await db.userwallets.add({accountindex: await get().accountindex});
    return { result1, result2, result3 };
  },
  
  // Async function to import a wallet using a provided mnemonic and password.
  importWallet: async (mnemonic, password) => {
    const wallets = await get().wallets;
      // Check if there are existing wallets before importing a new one.
    if (wallets.length > 0) {
      console.error("Need to logout wallet before importing new wallet");
    }
    // Validate the provided mnemonic and check if a password already exists.
    if (!(await validatemnemonic(mnemonic))) {
      console.error("Invalid Mnemonic");
    }
    
    if (!((await get().password) === "")) {
      alert("Wallet already exists not able to generate password again");
    }
    
  // Open the Dexie database, generate a password hash, and import the wallet.
    await db.open();
    const pwdHash = await generatePasswordHash(password);
    const wallet = await importWallet(mnemonic);
    // Update the state with the imported wallet, password, and mnemonic information.
    const words = mnemonic.split(" ");
    const mnemonicCodes = [];
    words.forEach((word) => {
      mnemonicCodes.push(word);
    });
    const network = wallet.map((network) => {
      return network.network;
    });
    set(() => ({
      password: pwdHash,
      mnemonicArray: [mnemonicCodes],
      wallets: [wallet],
      networks: [network],
    }));

    // Store the updated password, mnemonic, wallet, and network information in the Dexie database.
    const passwordresult = await db.userdetails.add({
      Password: await get().password,
    });
    const mnemonicresult = await db.userdetails.add({
      mnemonicArray: await get().mnemonicArray,
    });
    const walletresult = await db.userwallets.add({
      wallets: await get().wallets,
    });
    const networkresult = await db.userwallets.add({
      networks: await get().networks,
    });
    return { passwordresult, mnemonicresult, walletresult, networkresult };
  },

   // Async function to generate a new account with a given account name.
  generateNewAccount: async (accountname) => {
     // Retrieve user details and wallets information from the Dexie database.
    const userdetails = await db.userdetails.toArray();
    const userwallets = await db.userwallets.toArray();
    const mnemonic = userdetails.map((user) => user.mnemonicArray).join(" ");
    const usernetworks = userwallets[1].networks;
    let wallets = userwallets[0].wallets[0];
    let index = userwallets[2].accountindex.length;
      // Extract network data and generate new accounts for each network.
    const networkdata = usernetworks[0].map((network) => {
      return network;
    });
    let accounts = [];
    for (const network of networkdata) {
      const newAccount = await generateNewAccount(
        mnemonic.split(",").join(" ").trim(),
        network.rpcUrl,
        accountname,
        index
      );
      newAccount.network = network;
      accounts.push(newAccount);
    }

    // Modify the structure of existing wallets to accommodate the new accounts.
    wallets = wallets.map((wallet) => {
      wallet.accountName = wallet.accountName.toString().split(",");
      wallet.address = wallet.address.toString().split(",");
      wallet.network = wallet.network;
      wallet.privateKey = wallet.privateKey.toString().split(",");
      wallet.ERC20tokens = wallet.ERC20tokens;
      wallet.ERC721tokens = wallet.ERC721tokens;
      wallet.txActivity = wallet.txActivity;
      return wallet;
    });

    // Group wallets by chainId and update the accounts for each chainId.
    const walletsByChainId = new Map();
    wallets.forEach((wallet) => {
      const chainId = wallet.network.chainId;
      if (!walletsByChainId.has(chainId)) {
        walletsByChainId.set(chainId, []);
      }
      walletsByChainId.get(chainId).push(wallet);
    });
    accounts.forEach((account) => {
      const chainId = account.network.chainId;
      const walletsForChainId = walletsByChainId.get(chainId);
      if (walletsForChainId) {
        walletsForChainId.forEach((wallet) => {
          wallet.accountName.push(account.accountName);
          wallet.address.push(account.address);
          wallet.privateKey.push(account.privateKey);
          wallet.ERC20tokens.push(account.ERC20tokens);
          wallet.ERC721tokens.push(account.ERC721tokens);
          wallet.txActivity.push(account.txActivity);
        });
      }
    });

    // Update the state with the modified wallets and account index.
    wallets = wallets.splice(
      0,
      wallets.length,
      ...Array.from(walletsByChainId.values())
    );
    index = index + 1;
    set(() => ({
      wallets: [wallets],
      accountindex: [index],
    }));

    // Store the updated wallets and account index in the Dexie database.
    const result1 = await db.userwallets.update(1, {
      wallets: await get().wallets,
    });
    const result2 = await db.userwallets.update(3, {
      accountindex: await get().accountindex,
    });
    return { result1, result2 };
  },
  
  // Async function to get an existing account using the provided account name, private key, and chainId.
  getExistingAccount:async(accountname,privateKey,chainId)=>{
     // Retrieve user wallets from the Dexie database
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    // Find the index of the network based on the provided chainId.
    const networkindex = wallets.findIndex((wallet)=>
    (wallet.network.chainId === chainId)
  )
  // Get the RPC URL for the network.
  const rpcUrl = wallets[networkindex].network.rpcUrl;
   // Get the existing account
   const account = await getExistingAccount(accountname,privateKey,rpcUrl);
   
  wallets[networkindex].accountName.push(account.accountName);
  wallets[networkindex].address.push(account.address);
  wallets[networkindex].privateKey.push(account.privateKey);
  wallets[networkindex].ERC20tokens.push(account.ERC20tokens);
  wallets[networkindex].ERC721tokens.push(account.ERC721tokens);
  wallets[networkindex].txActivity.push(account.txActivity);
  account.network=wallets[networkindex].network;

  set(() => ({
    wallets: [wallets],
  }));

const result = await db.userwallets.update(1,{wallets: await get().wallets});
return result;
  },

  // Async function to get the current nonce for a wallet address on a specific chain.
  getCurrentNonce:async(chainId, walletAddress)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex((wallet)=>
    (wallet.network.chainId === chainId)
  )
  const rpcUrl = wallets[networkindex].network.rpcUrl;
  const nonce = await getCurrentNonce(rpcUrl, walletAddress);
  return nonce;
  },

// Async function to get the balance for a wallet address on a specific chain.
  getBalance:async(chainId, address)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex((wallet)=>
    (wallet.network.chainId === chainId)
  )
  const rpcUrl = wallets[networkindex].network.rpcUrl;
   const balance = await getBalance(rpcUrl, address);
   return balance;
  },

// Async function to estimate gas for a transaction using ERC20 tokens on a specific chain.
  estimateGas:async (account,recipientAddress, amount, symbol,chainId) =>{
    
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex((wallet)=>
    (wallet.network.chainId === chainId)
  )
  const rpcUrl = wallets[networkindex].network.rpcUrl;
    const result= await estimateGas(account.address,account.privateKey,recipientAddress, amount, symbol,chainId,rpcUrl);
    return result;
  },

  // Async function to get details of an ERC20 token using its address on a specific chain.
  getTokenDetails: async (tokenaddress,chainId) => {
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    const rpcUrl = wallets[networkindex].network.rpcUrl;
    const result = await getTokenDetails(tokenaddress,rpcUrl);
    return result; 
  },

  // Async function to get the RPC URL for a specific chain.
  getchainRpcUrl: async(chainId) => {
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    const rpcUrl = wallets[networkindex].network.rpcUrl;
    return rpcUrl;
  },

  // Async function to transfer ERC20 tokens from one wallet to another on a specific chain.
  transferERC20Tokens:async(recipientAddress,useraddress,amount,tokenAddress,chainId)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    
    const accountindex = wallets[networkindex].address.findIndex(
      (address) => address === useraddress
    );
    const privateKey = wallets[networkindex].privateKey[accountindex];
    const rpcUrl = wallets[networkindex].network.rpcUrl;
    const result = await transferERC20Tokens(privateKey,recipientAddress,amount,tokenAddress,rpcUrl);
    return result;
  },

  // Async function to export the Dexie database and download it as a JSON file.
  exportDB: async() => {
    const dbfile = await exportDB(db);
    const url = window.URL.createObjectURL(dbfile);
    const a = document.createElement("a");
    a.href = url;
   a.download = "BackupWallet.json";
   a.click();
  },


// Async function to transfer funds from one wallet to another on a specific chain.
  transferFunds:async(account,recipientAddress,amount,symbol,chainId)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex((wallet)=>
    (wallet.network.chainId === chainId)
  )
  const rpcUrl = wallets[networkindex].network.rpcUrl;
   const result = await transferFunds(account.privateKey,recipientAddress,amount,symbol,chainId,rpcUrl);
   return result;   
  },

  // Async function to add a new network to the user's wallet.
  addNetwork: async (networkdata) => {
    const userdetails = await db.userdetails.toArray();
    const userwallets = await db.userwallets.toArray();
    let usernetworks = userwallets[1].networks[0];
    let wallets = userwallets[0].wallets[0];
    const mnemonic = userdetails.map((user) => user.mnemonicArray).join(" ");
    usernetworks.push(networkdata);
    let newAccount = await generateWalletNewNetwork(
      mnemonic.split(",").join(" ").trim(),
      networkdata.rpcUrl
    );
    newAccount.network = networkdata;
    newAccount = { network: newAccount.network, ...newAccount };
    wallets.push(newAccount);

    set(() => ({
      wallets: [wallets],
      networks: [usernetworks],
    }));
    const result1 = await db.userwallets.update(1, {
      wallets: await get().wallets,
    });
    const result2 = await db.userwallets.update(2, {
      networks: await get().networks,
    });
    return { result1, result2 };
  },

  // Async function to reset the password using the mnemonic and a new password.
  forgetpassword: async (userMnemonic, password) => {
    const userdetails = await db.userdetails.toArray();
    let mnemonic = userdetails.map((user) => user.mnemonicArray).join(" ");
    mnemonic = mnemonic.trim();
    userMnemonic = userMnemonic.split(" ");
    mnemonic = mnemonic.split(",");
    if (!(userMnemonic.join(" ") === mnemonic.join(" "))) {
      alert("Mnemonic Phrase is not matched");
    }
     // Generate a new password hash and update the state and database.
    const pwdHash = await generatePasswordHash(password);
    set(() => ({
      password: pwdHash,
    }));
    const result = await db.userdetails.update(2, {
      Password: await get().password,
    });
    return result;
  },

  // Async function to validate the password during login.
  login:async(userpassword)=>{
    const userpwd = await generatePasswordHash(userpassword);
    const userdetails = await db.userdetails.toArray();
    let pwd = userdetails[1].Password[0];
 pwd=(userpwd === pwd)? userdetails[1].Password[0]: userdetails[1].Password;
 // Check if the hashed user password matches the stored password hash.
    const result = (userpwd === pwd) ? true : false;
    return result;
  },

  // Async function to validate the user's password.
  validatepassword: async (userpassword) => {
    const userpwd = await generatePasswordHash(userpassword);
    const userdetails = await db.userdetails.toArray();
    const pwd = userdetails[1].Password[0];
    const result = (userpwd === pwd) ? true : false;
    return result;
  },

  // Async function to check if the user has any wallets.
  validateOwnwallet: async () => {
    const userwallets = await db.userwallets.toArray();
    let wallets = userwallets[0].wallets[0];
    const result = wallets.length > 0 ? true : false;
    return result;
  },

  // Async function to set the authentication status in the state.
  setisAuthenticated: async (isAuth) => {
    set(() => ({
      isAuthenticated: isAuth,
    }));
  },

  // Async function to set the hadwallet status in the state and update it in local storage and database.
  sethadwallet: async (ishadwallet) => {
    set(() => ({
      hadwallet: ishadwallet,
    }));
    localStorage.setItem("hadwallet", ishadwallet);
    const result = await db.userdetails.update(1, {
      hadwallet: await get().hadwallet,
    });
    return result;
  },

  // Async function to get the hadwallet status from the database.
  gethadwallet: async () => {
    const userdetails = await db.userdetails.toArray();
    let hadwallet = userdetails[0].hadwallet[0];
    return hadwallet;
  },

  // Async function to add hadwallet status to the database.
  addhadwallet: async () => {
    const userdetails = await db.userdetails.toArray();

    if (userdetails.length === 0) {
      const result = await db.userdetails.add({
        hadwallet: await get().hadwallet,
      });
      return result;
    } else {
      alert("Wallet exists already");
      return false;
    }
  },

// Async function to get the balance of ERC20 tokens for a specific address and chain.
  getERC20Balance:async(tokenaddress,useraddress,chainId)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex((wallet)=>
    (wallet.network.chainId === chainId)
  )
  const rpcUrl = wallets[networkindex].network.rpcUrl;
    const result = await BalanceOfERC20Tokens(tokenaddress,useraddress,rpcUrl);
     return result;
  },
  
// Async function to import ERC20 tokens for a specific address and chain.
  importERC20Tokens:async(tokenaddress,useraddress,tokensymbol,tokenDecimals,chainId)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex((wallet)=>
    (wallet.network.chainId === chainId)
  )
  const rpcUrl = wallets[networkindex].network.rpcUrl;
  const tokenbalance = await BalanceOfERC20Tokens(tokenaddress,useraddress,rpcUrl);
   const ERC20 = {
    tokenaddress,tokensymbol,tokenDecimals,tokenbalance:tokenbalance.balance
   }
  const accountindex = wallets[networkindex].address.findIndex((address)=>
      (address === useraddress)
    );
   wallets[networkindex].ERC20tokens[accountindex].push(ERC20);
  set(() => ({
    wallets: [wallets],
  }));
const result = await db.userwallets.update(1,{wallets: await get().wallets});
   return result;
  },

  // Async function to import ERC721 tokens for a specific address and chain.
  impotERC721Tokens:async(tokenaddress,useraddress,chainId)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex((wallet)=>
    (wallet.network.chainId === chainId)
  )
const rpcUrl = wallets[networkindex].network.rpcUrl;
  const accountindex = wallets[networkindex].address.findIndex((address)=>
      (address === useraddress)
    );
    const tokenbalance = await BalanceOfERC721Tokens(tokenaddress,useraddress,rpcUrl);
   const ERC721 = {
    tokenaddress,tokenbalance:tokenbalance.balance
   }
   
   wallets[networkindex].ERC721tokens[accountindex].push(ERC721);
  set(() => ({
    wallets: [wallets],
  }));
const result = await db.userwallets.update(1,{wallets: await get().wallets});
   return result;
  },

  // Async function to record transaction activity for a specific address and chain.
  txactivity: async (txactivity, useraddress, chainId) => {
    try{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );

    const accountindex = wallets[networkindex].address.findIndex(
      (address) => address === useraddress
    ); 
   txactivity = JSON.stringify(txactivity);
   txactivity =JSON.parse(txactivity);
    wallets[networkindex].txActivity[accountindex].push(txactivity);
    set(() => ({
      wallets: [wallets],
    }));
    const result = await db.userwallets.update(1,{wallets: await get().wallets});
    return result;
  }catch(error){
  
    console.log(error)
  }
  },

  // Async function to get transaction activity for a specific address and chain.
  gettxActivity: async (useraddress, chainId) => {
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    const accountindex = wallets[networkindex].address.findIndex(
      (address) => address === useraddress
    );
    return wallets[networkindex].txActivity[accountindex];
  },

  // Async function to reset the entire wallet state and clear the database.
  resetWallet: async () => {
    set(() => ({
      isAuthenticated: false,
      hadwallet: false,
      password: "",
      mnemonicArray: [],
      accountindex: [],
      wallets: [],
      networks: [],
    }));

    await db.delete();
    localStorage.setItem("hadwallet", false);
    await db.open();
  },

  // Async function to get account details including privateKey and accountName for a specific address and chain.
  getAccountDetails: async (chainId, userpassword, useraddress) => {
    const userwallet = await db.userwallets.toArray();
    const userdetails = await db.userdetails.toArray();
    const password = userdetails[0].Password[0];
    let wallets = await userwallet[0].wallets[0];
      // Check if the entered password matches the stored password.
    if (!password === userpassword) {
      alert("Password Not Matched");
    }
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    const accountindex = wallets[networkindex].address.findIndex(
      (address) => address === useraddress
    );
    // Retrieve privateKey and accountName for the specified address.
    const privateKey = wallets[networkindex].privateKey[accountindex];
    const accountName = wallets[networkindex].accountName[accountindex];
    return { privateKey, accountName };
  },

  // Async function to remove a network by its chainId.
  removeNetwork: async(chainId)=>{
    const defaultntwrk = [1,5,137,80001,56,97]
    // Check if the chainId is part of default networks that cannot be deleted.
    if(defaultntwrk.includes(chainId)) {
      alert("Wallet Default Networks cannot be deleted");
    }else{
      const userwallet = await db.userwallets.toArray();
      let wallets = await userwallet[0].wallets[0];
      const usernetworks = userwallet[1].networks[0];
      const networkindex = wallets.findIndex(
        (wallet) => wallet.network.chainId === chainId
      );
     // Remove the network from wallets and usernetworks arrays.
      wallets.splice(networkindex,1);
      usernetworks.splice(networkindex,1);
  
    set(() => ({
      wallets: [wallets],
      networks:[usernetworks]
    }));
    const walletresult = await db.userwallets.update(1, {
      wallets: await get().wallets,
    });
    const networkresult = await db.userwallets.update(2, {
      networks: await get().networks,
    });
    return {walletresult,networkresult};
  }
  },

  // Async function to remove an account by its accountindex and chainId.
  removeAccount:async(useraddress,chainId)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    
    const accountindex = wallets[networkindex].address.findIndex(
      (address) => address === useraddress
    );

    wallets[networkindex].accountName.splice(accountindex,1);
   wallets[networkindex].address.splice(accountindex,1);
  wallets[networkindex].privateKey.splice(accountindex,1);
  wallets[networkindex].ERC20tokens.splice(accountindex,1);
  wallets[networkindex].ERC721tokens.splice(accountindex,1);
  wallets[networkindex].txActivity.splice(accountindex,1);
  set(() => ({
    wallets: [wallets],
  }));
  const result = await db.userwallets.update(1, {
    wallets: await get().wallets,
  });
  return result;
  }, 
  // Async function to update the token balance for a specific token address, user address, and chainId.
  updateTokenBalance: async (tokenaddress,useraddress,chainId) => {
    console.log(tokenaddress,useraddress,chainId);
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    const rpcUrl = wallets[networkindex].network.rpcUrl;
    const result = await BalanceOfERC20Tokens(tokenaddress,useraddress,rpcUrl)
     return result; 
  },

  // Async function to remove an ERC20 token by useraddress, tokenaddress, and chainId.
  removeERC20Token:async(useraddress,tokenaddress,chainId)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    
    const accountindex = wallets[networkindex].address.findIndex(
      (address) => address === useraddress
    );

    const tokenindex = wallets[networkindex].ERC20tokens[accountindex].find(
      (token) => token.tokenaddress === tokenaddress
    );
  if(networkindex && accountindex && tokenindex){
    wallets[networkindex].ERC20tokens[accountindex].splice(tokenindex,1);

  set(() => ({
    wallets: [wallets],
  }));
  const result = await db.userwallets.update(1, {
    wallets: await get().wallets,
  });
  return result;
  }
  },
exportDB: async() => {
    const dbfile = await exportDB(db);
    const url = window.URL.createObjectURL(dbfile);
    const a = document.createElement("a");
    a.href = url;
   a.download = "BackupWallet.json";
   a.click();
  },
  transferERC20Tokens:async(recipientAddress,useraddress,amount,tokenAddress,chainId)=>{
    const userwallet = await db.userwallets.toArray();
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    
    const accountindex = wallets[networkindex].address.findIndex(
      (address) => address === useraddress
    );
    const privateKey = wallets[networkindex].privateKey[accountindex];
    const rpcUrl = wallets[networkindex].network.rpcUrl;
    const result = await transferERC20Tokens(privateKey,recipientAddress,amount,tokenAddress,rpcUrl);
    return result;
  },
  backupAccountKeystore: async(useraddress,chainId) => {
    const userdetails = await db.userdetails.toArray();
    const userwallet = await db.userwallets.toArray();
    const password = userdetails[1].Password;
    let wallets = await userwallet[0].wallets[0];
    const networkindex = wallets.findIndex(
      (wallet) => wallet.network.chainId === chainId
    );
    const accountindex = wallets[networkindex].address.findIndex(
      (address) => address === useraddress
    );
    const rpcUrl = wallets[networkindex].network.rpcUrl;
    const privateKey = wallets[networkindex].privateKey[accountindex];
    
    const keystore = await backupAccountKeystore(privateKey,password,rpcUrl);
    const keystoreFile = `keystore_${useraddress}.json`;
    
    return keystoreFile;
  },
}));

export default userStore;
