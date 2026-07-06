# IP Tracker Website

A simple website that tracks and displays visitor IP addresses in real-time.

## Features

- 🔍 Captures visitor IP addresses automatically
- 📊 Displays unique visitor count and total visits
- 📝 Maintains a log of all visitors with visit timestamps
- 🎨 Beautiful, responsive UI
- ⚡ Real-time updates (auto-refreshes every 5 seconds)
- 💾 Persists data to JSON file

## Requirements

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/fsoipseojk/1.git
cd 1
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Start the server

```bash
npm start
```

The website will be available at `http://localhost:3000`

### Development mode (with auto-reload)

```bash
npm run dev
```

## API Endpoints

- `GET /` - Main website page
- `GET /api/my-ip` - Get your current IP address
- `GET /api/visitors` - Get all visitor data (JSON)

## Data Storage

Visitor IP data is stored in `visitor_ips.json` in the root directory. Each entry contains:

- `ip` - The visitor's IP address
- `visits` - Number of times this IP has visited
- `firstVisit` - Timestamp of first visit
- `lastVisit` - Timestamp of most recent visit

## How it Works

1. When a visitor accesses the website, the server captures their IP address
2. The IP is checked against existing entries in the JSON file
3. If new, a new entry is created; if existing, visit count and timestamp are updated
4. The frontend displays real-time statistics and a visitor log

## Notes

- The app supports both direct connections and proxied connections (X-Forwarded-For)
- Data persists between server restarts
- The JSON file is created automatically on first visit

## License

ISC
