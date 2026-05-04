const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(fileBuffer, options) {
  return await imagekit.upload({
    file: fileBuffer,
    fileName: options.fileName,
    folder: options.folder,
  });
}

module.exports = { uploadFile, imagekit };
