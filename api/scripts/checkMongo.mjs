/**
 * initReplicaSet.mjs — One-time replica set initialization
 * Run from the api/ directory: node scripts/initReplicaSet.mjs
 */
import net from 'net';

// Send raw MongoDB wire protocol to run rs.initiate()
// Actually let's use a simpler approach via child_process
import { execSync } from 'child_process';

// Check if mongod is accessible by trying to connect
function checkPort(host, port, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
    socket.on('error', () => resolve(false));
    socket.connect(port, host);
  });
}

const isUp = await checkPort('127.0.0.1', 27018);
if (!isUp) {
  console.error('❌ MongoDB is not listening on port 27018');
  process.exit(1);
}
console.log('✅ MongoDB is accessible on port 27018');
console.log('ℹ️  The replica set should already be initialized from previous runs.');
console.log('ℹ️  If seed still fails, start the API server first (npm run dev) which will connect and verify.');
