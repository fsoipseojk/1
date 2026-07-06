const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const IPS_FILE = path.join(__dirname, 'visitor_ips.json');

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('public'));

// Helper function to get client IP
function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip
  );
}

// Helper function to load IPs from file
function loadIPs() {
  try {
    if (fs.existsSync(IPS_FILE)) {
      const data = fs.readFileSync(IPS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading IPs:', error);
  }
  return [];
}

// Helper function to save IPs to file
function saveIPs(ips) {
  try {
    fs.writeFileSync(IPS_FILE, JSON.stringify(ips, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving IPs:', error);
  }
}

// Track visitor IP on every request
app.use((req, res, next) => {
  const clientIP = getClientIP(req);
  const timestamp = new Date().toISOString();
  
  const ips = loadIPs();
  
  // Check if this IP already exists
  const existingEntry = ips.find(entry => entry.ip === clientIP);
  
  if (existingEntry) {
    existingEntry.visits += 1;
    existingEntry.lastVisit = timestamp;
  } else {
    ips.push({
      ip: clientIP,
      visits: 1,
      firstVisit: timestamp,
      lastVisit: timestamp
    });
  }
  
  saveIPs(ips);
  next();
});

// Route: Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route: Get all visitor IPs (API)
app.get('/api/visitors', (req, res) => {
  const ips = loadIPs();
  res.json({
    totalVisitors: ips.length,
    totalVisits: ips.reduce((sum, entry) => sum + entry.visits, 0),
    visitors: ips.sort((a, b) => b.visits - a.visits)
  });
});

// Route: Get current visitor IP
app.get('/api/my-ip', (req, res) => {
  const clientIP = getClientIP(req);
  res.json({ ip: clientIP });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Visitor IPs are being stored in ${IPS_FILE}`);
});
