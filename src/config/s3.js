const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const uploadToS3 = async (file, fileName) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `profile-pictures/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Construir la URL del objeto
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profile-pictures/${fileName}`;
  } catch (error) {
    console.error('Error al subir archivo a S3:', error);
    throw error;
  }
};

module.exports = {
  uploadToS3
}; 