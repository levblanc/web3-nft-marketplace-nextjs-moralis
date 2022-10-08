// Create a new able called 'ActiveItem'
// Add items when they are listed on the marketplace
// Remove them when they are bought or canceled

// Moralis object will be auto-injected into our script on moralis platform
Moralis.Cloud.afterSave('ItemListed', async (request) => {
  // Every event gets triggered twice, once on unconfirmed, again on confirmed
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info('Looking for confirmed Tx');

  logger.info(`confirmed? ${confirmed}`);

  if (confirmed) {
    logger.info('Found item!');
    const ActiveItem = Moralis.Object.extend('ActiveItem');
    const activeItem = new ActiveItem();
    logger.info('After init activeItem');

    const marketplaceAddress = request.object.get('address');
    activeItem.set('marketplaceAddress', marketplaceAddress);
    logger.info(`marketplaceAddress: ${marketplaceAddress}`);

    const nftAddress = request.object.get('nftAddress');
    activeItem.set('nftAddress', nftAddress);
    logger.info(`nftAddress: ${nftAddress}`);

    const price = request.object.get('price');
    activeItem.set('price', price);
    logger.info(`price: ${price}`);

    const tokenId = request.object.get('tokenId');
    activeItem.set('tokenId', tokenId);
    logger.info(`tokenId: ${tokenId}`);

    const seller = request.object.get('seller');
    activeItem.set('seller', seller);
    logger.info(`seller: ${seller}`);

    logger.info(`Adding Address: ${marketplaceAddress}`);
    logger.info(`tokenId: ${tokenId}`);

    logger.info('Saving...');
    await activeItem.save();
  }
});
