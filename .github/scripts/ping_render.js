const https = require('https');

const url = 'https://keyboardstore-229r.onrender.com/';

console.log(`🔄 Enviando petición Keep-Alive a Render: ${url}...`);

const req = https.get(url, { timeout: 60000 }, (res) => {
  console.log(`Status HTTP recibido de Render: ${res.statusCode}`);
  if (res.statusCode >= 200 && res.statusCode < 400) {
    console.log('✅ Instancia de Render despierta y respondiendo correctamente.');
    process.exit(0);
  } else {
    console.log(`⚠️ Respuesta de Render con estado HTTP ${res.statusCode}`);
    process.exit(0);
  }
});

req.on('error', (error) => {
  console.log(`⚠️ La petición contactó a Render (puede estar inicializando): ${error.message}`);
  process.exit(0);
});

req.on('timeout', () => {
  console.log('⏱️ Timeout de 60s alcanzado, pero el ping sirvió para despertar la instancia.');
  req.destroy();
  process.exit(0);
});
