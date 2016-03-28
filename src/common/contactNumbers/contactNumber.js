import { Record } from 'immutable';

const ContactNumber = Record({
  id: '',
  contactNumber: '',
  countryCode: '',
  contactNumberType: '',
  contactNumberTypeId: '',
  areaCode: '',
  ext: '',
  verifiedAt: null,
  verifiedBy: '',
  source: '',
  debtorId: null,
});

export default ContactNumber;
