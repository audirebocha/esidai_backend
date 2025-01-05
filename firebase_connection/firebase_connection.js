import admin from 'firebase-admin'
import service_account from './service_account.js'

admin.initializeApp({
    credential:admin.credential.cert(service_account),
    databaseURL:"https://t0-python-default-rtdb.europe-west1.firebasedatabase.app/"
})

const db= admin.database();
export default db

