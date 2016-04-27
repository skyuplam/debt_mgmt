import express from 'express';
// import models from '../models';
import logger from '../lib/logger';
import multer from 'multer';
import moment from 'moment';
import XLSX from 'xlsx';
import Boarding from '../lib/Boarding';
import passport from 'passport';

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
router.route('/boarding')
  .post(passport.authenticate('bearer', { session: false }), (req, res) => {
    try {
      upload(req, res, err => {
        if (err) {
          logger.warn(err);
          return res.status(400).json({ err });
        }
        const workbook = XLSX.readFile(req.file.path);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        return Boarding.boarding(worksheet).then(() =>
          res.status(202).end()
        );
      });
    } catch (err) {
      logger.warn(err);
      res.status(400).json({ err });
    }
  });

export default router;
