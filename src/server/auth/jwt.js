import jwt from 'jsonwebtoken';
import Promise from 'bluebird';

export function signAync(payload, secretOrPrivateKey, options) {
  return new Promise((resolve) => {
    jwt.sign(payload, secretOrPrivateKey, options, (token) =>
      resolve(token)
    );
  });
}

export function verifyAsync(token, secretOrPublicKey, options = {}) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, options, (err, decoded) => {
      if (err && Object.keys(err) > 0) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });
}
