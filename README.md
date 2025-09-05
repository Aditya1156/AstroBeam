# 🌟 AstroBeam - Cosmic File Transfer

A beautiful, secure peer-to-peer file sharing application with an astrology-themed interface. Share files directly between browsers using WebRTC technology with cosmic style.

![AstroBeam](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)

## ✨ Features

- 🚀 **Direct P2P Transfer** - Files transfer directly between browsers via WebRTC
- 🔒 **Secure & Private** - No files stored on servers, end-to-end transfer
- 📱 **QR Code Sharing** - Generate QR codes for easy mobile file sharing
- 🎨 **Astrology Theme** - Beautiful zodiac-inspired UI with cosmic animations
- 📊 **Transfer History** - Track your file sharing history locally
- ⚡ **Real-time Progress** - Live transfer progress with speed indicators
- 🌐 **Cross-Browser** - Works across different browsers and devices
- 📋 **Session Codes** - Simple 6-digit codes for easy file sharing

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **WebRTC** - Peer-to-peer communication

### Backend
- **Node.js** - JavaScript runtime
- **WebSocket (ws)** - Real-time signaling server
- **ES Modules** - Modern JavaScript modules

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aditya1156/AstroBeam.git
   cd AstroBeam
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

1. **Start the signaling server**
   ```bash
   cd server
   node signaling-server.js
   ```
   The WebSocket server will start on `ws://localhost:8080`

2. **Start the frontend development server**
   ```bash
   # In a new terminal, from the root directory
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## 📖 How to Use

### Sending Files
1. Open AstroBeam in your browser
2. Click **"Send Files"**
3. Select the files you want to share
4. Share the generated 6-digit session code or QR code
5. Wait for the receiver to connect

### Receiving Files
1. Open AstroBeam in another browser/device
2. Click **"Receive Files"**
3. Enter the session code from the sender
4. Accept the incoming files to start the transfer

## 🏗️ Project Structure

```
AstroBeam/
├── components/           # React UI components
│   ├── AppBar.tsx       # Navigation header
│   ├── Sender.tsx       # File sending interface
│   ├── Receiver.tsx     # File receiving interface
│   ├── Transfer.tsx     # Active transfer management
│   ├── History.tsx      # Transfer history view
│   └── icons/           # Zodiac-themed icons
├── hooks/
│   └── useAstroBeam.ts  # Core WebRTC logic
├── server/
│   ├── signaling-server.js  # WebSocket signaling server
│   └── package.json     # Server dependencies
├── App.tsx              # Main application component
├── types.ts             # TypeScript type definitions
└── constants.ts         # Application constants
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
VITE_SIGNALING_SERVER_URL=ws://localhost:8080
```

### STUN Servers
The application uses Google's public STUN servers by default. For production, consider using your own STUN/TURN servers:

```typescript
// In constants.ts
export const ICE_SERVERS = [
  { urls: 'stun:your-stun-server.com:3478' },
  { 
    urls: 'turn:your-turn-server.com:3478',
    username: 'your-username',
    credential: 'your-password'
  }
];
```

## 🚀 Production Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
The signaling server can be deployed to any Node.js hosting service:

```bash
cd server
npm install --production
node signaling-server.js
```

Recommended platforms:
- **Heroku** - Easy Node.js deployment
- **Railway** - Modern deployment platform
- **DigitalOcean App Platform** - Scalable hosting
- **AWS EC2** - Full server control

## 🔒 Security Features

- **No server-side file storage** - Files transfer directly between peers
- **Session-based connections** - Temporary sessions with unique codes
- **WebRTC encryption** - Built-in DTLS encryption for data channels
- **Input validation** - Comprehensive validation on all user inputs
- **Error handling** - Graceful error handling and user feedback

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Connection fails between browsers:**
- Ensure both devices are on the same network or have proper STUN/TURN configuration
- Check browser console for WebRTC errors
- Verify the signaling server is running

**Files not transferring:**
- Check browser compatibility (modern browsers required)
- Verify WebRTC support in both browsers
- Ensure sufficient browser storage space

**Signaling server issues:**
- Check if port 8080 is available
- Verify Node.js version compatibility
- Check server logs for detailed error messages

## 📧 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review browser console logs for detailed error information

## 🌟 Acknowledgments

- Built with modern web technologies
- Inspired by cosmic and astrology themes
- Powered by WebRTC for secure P2P communication

---

**Made with ❤️ and cosmic energy** ✨
