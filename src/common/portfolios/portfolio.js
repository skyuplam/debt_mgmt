import { Record } from 'immutable';

// Record is like class, but immutable and with default values.
// https://facebook.github.io/immutable-js/docs/#/Record
const Portfolio = Record({
  createdAt: undefined,
  id: undefined,
  updatedAt: undefined,
  company: Record(),
  biddedAt: undefined,
  cutoffAt: undefined,
  referenceCode: undefined,
});

export default Portfolio;

// // Note we can subclass Record to add en.wikipedia.org/wiki/Compound_key
// export default class extends User {

//   static id(email, provider) {
//     return [email, email].join();
//   }

//   get id() {
//     return [this.email, this.provider].join();
//   }

// }
