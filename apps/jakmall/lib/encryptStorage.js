import { EncryptStorage } from 'encrypt-storage';

export const encryptStorage = new EncryptStorage(process.env.NX_SECRET_TOKEN, {
  prefix: '@jakmall',
  storageType: 'sessionStorage',
  // stateManagementUse: true,
});

export default encryptStorage