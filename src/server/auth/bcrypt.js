import bcrypt from 'bcrypt';
import Promise from 'bluebird';


export default Promise.promisifyAll(bcrypt);
