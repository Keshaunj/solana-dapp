# Flash Firm Decentralized Exchange (DEX) - Frontend

## Overview
Flash Firm Decentrlaized Finance (DeFi)- is a non-custodial cryptocurrency exchange built on the Solana blockchain, featuring a React-based frontend with Vite and Tailwind CSS. Users can securely manage their wallets, send and receive tokens, and track transactions in real-time.

---

## Features
### Core Features
- **Wallet Integration**: Connect to non-custodial wallets (e.g., Phantom, Solflare).
- **Token Transactions**: Send and receive Solana-based tokens securely.
- **Real-Time Balance Check**: Display the current wallet balance.
- **Transaction History**: View all past transactions.
- **User Profiles**: Full CRUD functionality for user data management.
- **Authentication**: Secure login/signup using JWT.
- **Token Price Tracking**: View real-time price changes for Solana and other tokens.

### Additional Features
- **Responsive UI**: Built with Tailwind CSS for a seamless experience across devices.
- **Notifications**: Alerts for transaction success or failure.
- **Search Functionality**: Find and track various tokens easily.
- **Dark Mode Support**: Enhanced UI customization.

---

## Tech Stack
### Frontend
- **Framework**: React (Vite for optimized development)
- **UI Library**: Tailwind CSS for styling
- **State Management**: Context API / Redux
- **API Requests**: Axios for handling API calls
- **Routing**: React Router DOM
- **Wallet Integration**: Solana Web3.js

### Backend (Connected Services)
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT for secure authentication
- **Blockchain Interaction**: Solana’s Web3.js for wallet and transaction management
- **CORS Handling**: Middleware setup for cross-origin requests

---

## Project Structure
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page views (Dashboard, Login, Profile, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Helper functions and constants
│   ├── context/           # State management (Auth & Wallet Context)
│   ├── assets/            # Static assets (images, logos, etc.)
│   ├── App.jsx            # Main application file
│   ├── main.jsx           # Entry point
│   ├── router.jsx         # App routing
├── public/                # Static files
├── package.json           # Project dependencies
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

---

## Installation & Setup
### Prerequisites
Ensure you have **Node.js** and **npm** installed.

### Clone the Repository
```bash
git clone https://github.com/Keshaunj/solana-dapp.git
cd solana_dapp/frontend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
VITE_BACKEND_URL=http://localhost:5000  # Change to production URL when deployed
VITE_SOLANA_NETWORK=mainnet-beta  # Change to devnet if testing
```

### Run the Development Server
```bash
npm run dev
```

---

## Usage
### Connect Wallet
1. Click the "Connect Wallet" button.
2. Select a supported wallet (Phantom, Solflare, etc.).
3. Grant permissions to the application.

### Send Tokens
1. Enter the recipient's wallet address.
2. Input the amount to send.
3. Confirm and send the transaction.
4. View transaction history for confirmation.

### View Balance
1. Click on "Check Balance" in the dashboard.
2. The app will fetch and display your wallet balance.

### Manage Profile
1. Edit personal details such as username and email.
2. Delete your account if needed.

---

## Deployment
### Build for Production
```bash
npm run build
```
### Serve Build Files
```bash
npm run preview
```
Deploy the `dist/` folder using services like **Vercel.

---

## Contributing
1. Fork the repository.
2. Create a new branch.
3. Make changes and commit them.
4. Push your branch and open a pull request.

---

## Resources/Attributions  
- **Solana Documentation**: [https://docs.solana.com/](https://docs.solana.com/)
- **Web3.js**: [https://solana-labs.github.io/solana-web3.js/](https://solana-labs.github.io/solana-web3.js/)
- **React**: [https://reactjs.org/](https://reactjs.org/)
- **Tailwind CSS**: [https://tailwindcss.com/](https://tailwindcss.com/)
- **Vite**: [https://vitejs.dev/](https://vitejs.dev/)
- [Library/Framework Name](https://example.com) - Used for XYZ functionality  
- [External API Name](https://example.com) - Provides XYZ data  
- [Tutorial/reference](https://pages.git.generalassemb.ly/modular-curriculum-all-courses/jwt-authentication-in-flask-apis/setting-up-jwts/) - Helped with implementing JWT feature  
- [reference](https://solana.stackexchange.com/questions/7288/how-do-you-generate-a-base58-private-key) - Helped with implementing the Generate Private Key for Solana Wallets
- [web3 blochain intergration](https://www.npmjs.com/package/solana-web3.js) - Helped with implementing the Solana Web3.js
- [Font Styling](https://fonts.google.com/selection/embed) - Helped with implementing the Font Styling

---
[Flash Firm Defi- Logo](https://imgur.com/a/tMpoDU2)
[Website Image](https://imgur.com/a/XcirtQ6) - Image of Website 
[Flowchart/ERD](https://imgur.com/a/QubQJ6Q) - Flowchart/ERD of Website
[Claude](https://www.anthropic.com/claude) - Debugging and app structure
[YouTube-SolanaFloor](https://youtu.be/PkWq19uhcTA?si=Fkm3s-VCRi8auvbR) - Basic about Solana
[Youtube-Solana](https://youtu.be/amAq-WHAFs8?si=Whp2qSNerHyhrHhu) - Solana Web3.js ,full introduction refrence 
[Q&A-Stack Exchange](https://solana.stackexchange.com) question & Answer Forum for Solanan Devs
[Hacker Rank](https://www.hackerrank.com/)Helped with understand React Hooks & Context

## License
This project is licensed under the MIT License.

