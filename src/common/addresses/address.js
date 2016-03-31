import { Record } from 'immutable';

const ContactNumber = Record({
  id: '',
  address: '',
  longAddress: '',
  county: '',
  city: '',
  province: '',
  addressType: '',
  country: '',
  manicipality: '',
  debtorId: null,
  source: '',
  verifiedAt: null,
  verifiedBy: '',
});

export default ContactNumber;
