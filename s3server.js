const { S3 } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;

// const s3 = new S3({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
//   region: process.env.AWS_REGION,
//   signatureVersion: "v4",
// });

// exports.s3Uploadv2 = (file) =>
//   new Promise((resolve, reject) => {
//     const param = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: `uploads/${uuid()}-${file.originalname}`,
//       Body: file.buffer,
//     };

//     s3.putObject(param, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data);
//       }
//     });
//   });

exports.s3Uploadv2 = async (file) => {
  const s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${uuid()}-${file.originalname}`,
    Body: file.buffer,
  };

  try {
    const data = await s3.putObject(param);
    return data;
  } catch (err) {
    console.log(err.message);
  }
};
