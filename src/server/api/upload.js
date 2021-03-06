import express from 'express';
// import models from '../models';
import logger from '../lib/logger';
import multer from 'multer';
import moment from 'moment';
import XLSX from 'xlsx';
import Boarding from '../lib/Boarding';
import passport from 'passport';
import Placement from '../lib/Placement';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, done) => {
    done(null, `${file.fieldname}-${moment().format()}.${file.originalname.split('.')[1]}`);
  }
});
const upload = multer({
  storage
}).single('boarding');

const placement = multer({
  storage
}).single('placement');

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
        Boarding.boarding(worksheet);
        return res.status(202).end();
      });
    } catch (err) {
      logger.warn(err);
      res.status(400).json({ err });
    }
  });

router.route('/placement')
  .post(passport.authenticate('bearer', { session: false }), (req, res) => {
    try {
      placement(req, res, err => {
        if (err) {
          logger.warn(err);
          return res.status(400).json({ err });
        }
        const workbook = XLSX.readFile(req.file.path);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        Placement(worksheet);
        return res.status(202).end();
      });
    } catch (err) {
      logger.warn(err);
      res.status(400).json({ err });
    }
  });

export default router;
