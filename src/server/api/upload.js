import express from 'express';
// import models from '../models';
import logger from '../lib/logger';
import multer from 'multer';
import moment from 'moment';
import XLSX from 'xlsx';
import Boarding from '../lib/Boarding';


const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, done) => {
    done(null, `${file.fieldname}-${moment().format()}.${file.originalname.split('.')[1]}`);
  }
});
const upload = multer({
  storage
}).single('boarding');

const router = express.Router();
// TODO: Check Bearer Token
router.route('/boarding')
  .post((req, res) => {
    upload(req, res, err => {
      if (err) {
        logger.warn(err);
        return res.status(400).json({ err });
      }
      const workbook = XLSX.readFile(req.file.path);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      Boarding.boarding(worksheet);

      return res.status(202).end();
    });
  });

export default router;
