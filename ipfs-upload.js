// upload.js
const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');

async function upload() {
  const file = fs.readFileSync('./images/ejemplo.png');
  const response = await lighthouse.upload(file, 'ejemplo.png');
  console.log('✅ File uploaded:', response.data.Hash);
}

upload().catch(console.error);
