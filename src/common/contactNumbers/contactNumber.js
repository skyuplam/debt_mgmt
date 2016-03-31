import { Record } from 'immutable';

const ContactNumber = Record({
  id: '',
  contactNumber: '',
  contactPerson: '',
  relationship: '',
  relationshipId: null,
  countryCode: '',
  contactNumberType: '',
  contactNumberTypeId: '',
  areaCode: '',
  ext: '',
  verifiedAt: null,
  verifiedBy: '',
  source: '',
  sourceId: null,
  debtorId: null,
});

export default ContactNumber;
