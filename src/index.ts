import axios from 'axios';
import * as dotenv from 'dotenv';
import * as cron from 'node-cron';

dotenv.config();

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  price: number;
}

const fetchTokenPrice = async (tokenAddress: string) => {
  try {
    const response = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/solana/tokens/${tokenAddress}`
    );
    console.log(response.data.data.attributes.price_usd);
    
    return response.data.data.attributes.price_usd;
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
};

function checkPriceThresholds(tokenData: number) {
  const upperThreshold = parseFloat(process.env.UPPER_THRESHOLD || '1000');
  const lowerThreshold = parseFloat(process.env.LOWER_THRESHOLD || '900');
  const tokenName = process.env.TOKEN_NAME || 'Token';

  if (tokenData > upperThreshold) {
    console.log(`ALERT: ${tokenName} (${tokenData}) price is above $${upperThreshold}!`);
    console.log(`Current price: $${tokenData}`);
  } else if (tokenData < lowerThreshold) {
    console.log(`ALERT: ${tokenName} (${tokenData}) price is below $${lowerThreshold}!`);
    console.log(`Current price: $${tokenData}`);
  } else {
    console.log(`${tokenName} (${tokenData}) price: $${tokenData}`);
  }
}

async function monitorPrice() {
  const tokenId = process.env.CRYPTO_ID;
  
  if (!tokenId) {
    console.error('CRYPTO_ID is not set in the .env file');
    return;
  }

  try {
    const tokenData = await fetchTokenPrice(tokenId);
    checkPriceThresholds(tokenData);
  } catch (error) {
    console.error('Failed to monitor price:', error);
  }
}

const checkIntervalMinutes = process.env.CHECK_INTERVAL_MINUTES || '5';
cron.schedule(`*/${checkIntervalMinutes} * * * *`, () => {
  console.log('Running price check...');
  monitorPrice();
});

console.log(`Price monitoring started. Checking every ${checkIntervalMinutes} minutes.`);
monitorPrice(); // Run immediately on start