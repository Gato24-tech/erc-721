const lighthouse = require('@lighthouse-web3/sdk');
const fs = require('fs');
const path = require('path');

async function uploadFolder() {
  const folderPath = path.join(__dirname, 'images');
  const files = fs.readdirSync(folderPath);

  for (const fileName of files) {
    const filePath = path.join(folderPath, fileName);
    const file = fs.readFileSync(filePath);
    const response = await lighthouse.upload(file, fileName);
    console.log(`✅ Uploaded: ${fileName} → CID: ${response.data.Hash}`);
  }
}

uploadFolder().catch(console.error);
