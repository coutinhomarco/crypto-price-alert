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

const sendTelegramAlert = async (message: string) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured');
    return;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    console.error('Error sending Telegram alert:', error);
  }
};

const checkPriceThresholds = async (tokenData: number) => {
  const upperThreshold = parseFloat(process.env.UPPER_THRESHOLD || '1000');
  const lowerThreshold = parseFloat(process.env.LOWER_THRESHOLD || '900');
  const tokenName = process.env.TOKEN_NAME || 'Token';

  if (tokenData > upperThreshold) {
    const message = `🚨 *${tokenName} Price Alert* 🚨\n\nPrice is *above* $${upperThreshold}!\nCurrent price: $${tokenData}`;
    console.log(message);
    await sendTelegramAlert(message);
  } else if (tokenData < lowerThreshold) {
    const message = `🚨 *${tokenName} Price Alert* 🚨\n\nPrice is *below* $${lowerThreshold}!\nCurrent price: $${tokenData}`;
    console.log(message);
    await sendTelegramAlert(message);
  } else {
    console.log(`${tokenName} (${tokenData}) price: $${tokenData}`);
  }
};

async function monitorPrice() {
  const tokenId = process.env.CRYPTO_ID;
  
  if (!tokenId) {
    console.error('CRYPTO_ID is not set in the .env file');
    return;
  }

  try {
    const tokenData = await fetchTokenPrice(tokenId);
    await checkPriceThresholds(tokenData);
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