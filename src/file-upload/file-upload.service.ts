import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const spacesEndPoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');

// const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const AWS_S3_BUCKET_NAME = 'nome-storage-spaces';
const s3 = new AWS.S3({
  endpoint: spacesEndPoint,
  accessKeyId: 'accessKeyId',
  secretAccessKey: 'secretAccessKey',
});

@Injectable()
export class FileUploadService {
  constructor() {}

  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, function (error) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json({
          location: req.files[0].location,
          // urlAccess: this.getUrl(req.files[0].filename)
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: AWS_S3_BUCKET_NAME,
      // contentType: multerS3.AUTO_CONTENT_TYPE,
      // acl: 'public-read',
      acl: 'private',
      key: function (request, file, cb) {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array('upload', 1);

  getUrl(name: string) {
    const url = s3.getSignedUrl('getObject', {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: name,
      Expires: 60 * 5,
    });
    return url;
  }  
}
