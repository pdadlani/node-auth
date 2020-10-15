const router = require('express').Router();
const verify = require('./privateRoutes');
const AWS = require("aws-sdk");


// Get presigned S3 URL
router.post('/getsignedurl', verify, (req, res) => {
  const s3 = new AWS.S3();
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });


  const myBucket = process.env.AWS_BUCKET_NAME;
  const myKey = "file-name.pdf";
  const signedUrlExpireSeconds = 60 * 5;

  const url = s3.getSignedUrl("getObject", {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds,
  });
  res.send(url)
})

router.get('/', verify, (req, res) => {
  res.send(req.user);
  User.findByOne({_id: req.user}); // will pull out info on specific user
});

module.exports = router;