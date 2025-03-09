const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const uploadToS3 = async (file, fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `profile-pictures/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error al subir archivo a S3:', error);
    throw error;
  }
};

module.exports = {
  uploadToS3
}; 