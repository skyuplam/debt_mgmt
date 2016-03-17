import { Record } from 'immutable';

const ContactNumber = Record({
  id: '',
  contactNumber: '',
  countryCode: '',
  areaCode: '',
  ext: '',
  verifiedAt: null,
  verifiedBy: '',
  source: '',
  debtorId: null,
});

export default ContactNumber;
