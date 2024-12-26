
# Crypto Price Alert System

A Node.js application that monitors cryptocurrency prices and sends alerts when they cross specified thresholds.

## Features

- Real-time price monitoring using GeckoTerminal API
- Configurable price thresholds
- Customizable check intervals
- Immediate alerts when prices cross thresholds
- Support for any Solana-based token

## Installation

1. Clone the repository:
```bash
git clone https://github.com/coutinhomarco/crypto-price-alert.git
```

2. Navigate to the project directory:
```bash
cd crypto-price-alert
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```env
CRYPTO_ID=your_token_address
TOKEN_NAME=Your_Token_Name
UPPER_THRESHOLD=1000
LOWER_THRESHOLD=900
CHECK_INTERVAL_MINUTES=5
```

## Usage

Start the monitoring system:
```bash
npx ts-node src/index.ts
```

The system will:
1. Check the token price immediately on startup
2. Continue checking at the specified interval
3. Log alerts when prices cross the thresholds

## Configuration

### Environment Variables

| Variable               | Description                          | Default Value |
|------------------------|--------------------------------------|---------------|
| `CRYPTO_ID`            | Solana token address to monitor      | Required      |
| `TOKEN_NAME`           | Name of the token for alerts         | "Token"       |
| `UPPER_THRESHOLD`      | Price threshold for upper alert      | 1000          |
| `LOWER_THRESHOLD`      | Price threshold for lower alert      | 900           |
| `CHECK_INTERVAL_MINUTES`| Interval between price checks (minutes)| 5            |

## Example Output

```
Price monitoring started. Checking every 5 minutes.
Running price check...
MIRA (1001) price: $1001
ALERT: MIRA (1001) price is above $1000!
Current price: $1001
```

## Dependencies

- [axios](https://github.com/axios/axios) - HTTP client
- [dotenv](https://github.com/motdotla/dotenv) - Environment variable management
- [node-cron](https://github.com/node-cron/node-cron) - Job scheduling

## License

MIT License

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For support, please open an issue in the GitHub repository.
```

This README includes:
1. Clear project description
2. Installation instructions
3. Usage guide
4. Configuration details
5. Example output
6. Dependency information
7. License and contribution guidelines

It's comprehensive yet concise, making it easy for users to understand and use your project.
