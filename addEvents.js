const Moralis = require('moralis/node');
require('dotenv').config();
const run = require('./utils/runScript');
const contractAddresses = require('./constants/contractAddresses.json');
const marketplaceAbi = require('./constants/marketplaceAbi.json');

const {
  NEXT_PUBLIC_APP_ID: appId,
  NEXT_PUBLIC_SERVER_URL: serverUrl,
  moralisMasterKey: masterKey,
} = process.env;
const chainId = process.env.chainId || '31337';
const moralisChainId = chainId === '31337' ? '1337' : chainId;

const marketplaceAddress = contractAddresses[chainId].NFTMarketplace;

const addEvent = async () => {
  await Moralis.start({ serverUrl, appId, masterKey });

  console.log('>>>>>> Working with contract at address:', marketplaceAddress);

  const itemListedOptions = {
    chainId: moralisChainId,
    address: marketplaceAddress,
    sync_historical: true,
    topic: 'ItemListed(address, address, uint256, uint256)',
    tableName: 'ItemListed',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftContractAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ItemListed',
      type: 'event',
    },
  };

  const itemBoughtOptions = {
    chainId: moralisChainId,
    address: marketplaceAddress,
    sync_historical: true,
    topic: 'ItemBought(address, address, uint256, uint256)',
    tableName: 'ItemBought',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftContractAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ItemBought',
      type: 'event',
    },
  };

  const itemCanceledOptions = {
    chainId: moralisChainId,
    address: marketplaceAddress,
    sync_historical: true,
    topic: 'ItemCanceled(address, address, uint256)',
    tableName: 'ItemCanceled',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftContractAddress',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'ItemCanceled',
      type: 'event',
    },
  };

  const listedResp = await Moralis.Cloud.run(
    'watchContractEvent',
    itemListedOptions,
    { useMasterKey: true }
  );
  const boughtResp = await Moralis.Cloud.run(
    'watchContractEvent',
    itemBoughtOptions,
    { useMasterKey: true }
  );
  const canceledResp = await Moralis.Cloud.run(
    'watchContractEvent',
    itemCanceledOptions,
    { useMasterKey: true }
  );

  console.log('listedResp', listedResp);
  console.log('boughtResp', boughtResp);
  console.log('canceledResp', canceledResp);
  if (listedResp.success && boughtResp.success && canceledResp.success) {
    console.log('>>>>>> Updated database with watching events success!');
  } else {
    console.log('>>>>>> Something went wrong...');
  }
};

run(addEvent);
