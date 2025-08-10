
const admin = require('firebase-admin');

// Railway: Use environment variable for Firebase service account JSON
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<YOUR_FIREBASE_PROJECT>.firebaseio.com"
});

const db = admin.firestore();

// Generate realistic sensor readings
function generateData() {
  const voltage = 220 + (Math.random() * 10 - 5); // 215–225 V
  const current = 0.5 + Math.random() * 5;        // 0.5–5.5 A
  const power = voltage * current;

  // Get current time and add 5 hours 30 minutes
  const now = new Date();
  const offsetMs = 5.5 * 60 * 60 * 1000; // +5:30 in milliseconds
  const localTime = new Date(now.getTime() + offsetMs);

  // Format as ISO-like string with +05:30 offset
  const isoStringWithOffset = localTime.toISOString().replace('Z', '+05:30');

  return {
    voltage: parseFloat(voltage.toFixed(2)),
    current: parseFloat(current.toFixed(2)),
    power: parseFloat(power.toFixed(2)),
    timestamp: isoStringWithOffset
  };
}

// Send data to Firebase at intervals
async function sendToFirebase() {
  try {
    const data = generateData();
    await db.collection('energy_readings').add(data);
    console.log(`📤 Sent: ${data.voltage}V, ${data.current}A, ${data.power}W`);
  } catch (error) {
    console.error("❌ Error sending to Firebase:", error);
  }
}

// Start loop (every 2 seconds)
setInterval(sendToFirebase, 10000);

console.log("🚀 Mock ESP Server started — sending data to Firebase every 2s...");
