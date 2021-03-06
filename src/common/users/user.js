import { Record, List } from 'immutable';

// Record is like class, but immutable and with default values.
// https://facebook.github.io/immutable-js/docs/#/Record
const User = Record({
  createdAt: undefined,
  email: undefined,
  id: undefined,
  token: undefined,
  updatedAt: undefined,
  username: undefined,
  active: undefined,
  roles: List(),
});

export default User;

// // Note we can subclass Record to add en.wikipedia.org/wiki/Compound_key
// export default class extends User {

//   static id(email, provider) {
//     return [email, email].join();
//   }

//   get id() {
//     return [this.email, this.provider].join();
//   }

// }
