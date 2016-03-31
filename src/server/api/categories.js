import express from 'express';
import models from '../models';

const router = express.Router();

router.route('/relationships')
  .get((req, res) => {
    models.relationship.findAll().then(relationships =>
      res.status(200).send({ relationships }).end()
    );
  });

export default router;
