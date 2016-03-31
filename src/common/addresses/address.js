import { Record } from 'immutable';

const Address = Record({
  id: '',
  address: '',
  contactPerson: '',
  relationshipId: null,
  longAddress: '',
  county: '',
  city: '',
  province: '',
  addressType: '',
  country: '',
  manicipality: '',
  debtorId: null,
  source: '',
  sourceId: null,
  verifiedAt: null,
  verifiedBy: '',
});

export default Address;
