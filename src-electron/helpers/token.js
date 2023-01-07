/* eslint-disable */
import path from 'path'
import fs, { promises as fsAsync} from 'fs'
import pkcs11js from 'pkcs11js'
import { app,ipcMain } from 'electron'

const { FLASH_PIN } = process.env

const libAssoc = {
  'arm64-darwin': '/Library/Aktiv Co/Rutoken ECP/lib/librtpkcs11ecp.dylib',
  'macos-x86_64': '/Library/Aktiv Co/Rutoken ECP/lib/librtpkcs11ecp.dylib',
  'x64-win32': '/assets/lib/windows-x86_64/rtpkcs11ecp.dll',
  'x86-win32': '/assets/lib/windows-x86/rtpkcs11ecp.dll',
};
const PARAMS_ARR = ['tmp', 'id', 'name', 'version'];

const preObjParams = [
  { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_DATA },
  { type: pkcs11js.CKA_TOKEN, value: true },
  { type: pkcs11js.CKA_PRIVATE, value: false },
];

const pkcs11 = new pkcs11js.PKCS11();

function isMacOs(currentPlatform) {
  if (!currentPlatform) throw new Error('Bad arguments');
  return (currentPlatform === 'arm64-darwin' || currentPlatform === 'macos-x86_64');
}

async function getLib(){
  const currentPlatform = `${process.arch}-${process.platform}`;

  if (!libAssoc[currentPlatform]) throw Error('Platform not support', process.arch, process.platform);

  let lib = isMacOs(currentPlatform) ? libAssoc[currentPlatform]
    : path.join(process.cwd(), libAssoc[currentPlatform]);

  if(['x64-win32','x86-win32'].includes(currentPlatform)){
    const libUserData = path.join(app.getPath('userData'),'rtpkcs11ecp.dll')

    if(!fs.existsSync(libUserData)) {
      await fsAsync.copyFile(path.join(__dirname,libAssoc[currentPlatform]),libUserData)
    }

    lib = libUserData
  }
  
  return lib
}

let isLoad = false;

export async function initToken() {
  console.log('initToken');
  if(!isLoad){
    const lib = await getLib()
    console.log('PRE load', lib);
    pkcs11.load(lib);
    isLoad = true
    console.log('DONE load');
    console.log('PRE C_Initialize');
    pkcs11.C_Initialize();
    console.log('DONE C_Initialize');
  }

}

function setAttrVal(session, name, value) {
  const obj = [
    ...preObjParams,
    { type: pkcs11js.CKA_LABEL, value: `IA_${name.toUpperCase()}` },
  ];
  const nObject = pkcs11.C_CreateObject(session, obj);
  pkcs11.C_SetAttributeValue(session, nObject, [{ type: pkcs11js.CKA_VALUE, value }]);
  return true;
}

function getAttrVal(session, name) {
  const obj = [...preObjParams, { type: pkcs11js.CKA_LABEL, value: `IA_${name.toUpperCase()}` }];

  pkcs11.C_FindObjectsInit(session, obj);
  let hObject = pkcs11.C_FindObjects(session);

  let result = null;

  while (hObject) {
    const attrs = pkcs11.C_GetAttributeValue(session, hObject, [
      { type: pkcs11js.CKA_VALUE },
    ]);
    if (attrs && attrs.length) {
      result = attrs[0].value.toString();
    }
    hObject = pkcs11.C_FindObjects(session);
  }
  pkcs11.C_FindObjectsFinal(session);
  return result;
}

export async function readFlashParams() {
  let out = null;
  try {
    const slots = pkcs11.C_GetSlotList(true);
    if (!slots.length) throw new Error('Empty slots');

    const slot = slots[0];
    const tokenInfo = pkcs11.C_GetTokenInfo(slot);

    const serialNumber = tokenInfo.serialNumber.trim();
    // eslint-disable-next-line no-bitwise, max-len
    const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
    console.log('PRE C_Login', FLASH_PIN);
    pkcs11.C_Login(session, 1, FLASH_PIN);
    console.log('DONE C_Login');

    out = {
      serialNumber,
    };
    PARAMS_ARR.forEach((key) => {
      const value = getAttrVal(session, key);
      out[key] = value;
    });

    pkcs11.C_Logout(session);
    pkcs11.C_CloseSession(session);
  } catch (e) {
    console.error(e);
  }
  return out;
}

export async function writeFlashParam(name, value) {
  const out = null;
  try {
    const slots = pkcs11.C_GetSlotList(true);
    if (!slots.length) throw new Error('Empty slots');

    const slot = slots[0];
    // eslint-disable-next-line max-len, no-bitwise
    const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
    pkcs11.C_Login(session, 1, FLASH_PIN);

    setAttrVal(session, name, value);

    pkcs11.C_Logout(session);
    pkcs11.C_CloseSession(session);
  } catch (e) {
    console.error(e);
  }
  return out;
}

export function tokenFinalize() {
  pkcs11.C_Finalize();
}



ipcMain.handle('token-init', ()=> initToken())
ipcMain.handle('token-finalize', ()=> tokenFinalize())
ipcMain.handle('token-read', ()=> readFlashParams())
ipcMain.handle('test-cwd', ()=> __dirname)




