import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import express from 'express';
import cors from 'cors';

// Configure firebase-admin
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.applicationDefault();
const firebaseApp = admin.initializeApp(adminConfig);

// Configure firestore
const firestore = firebaseApp.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Configure nodemailer
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  }
});

exports.initializeUserData = functions.auth.user().onCreate(async user => {
  // Not checking if email is verified since only Google sign-in is enabled
  await firestore.collection('userTokens').doc(user.uid).set( { accountStatus: 'pending' })

  const tokenRef = firestore.collection('userTokens').doc(user.uid)
  const userRef = firestore.collection('users').doc(user.uid)
  const permissionsRef = firestore.collection('userPermissions').doc(user.email)

  await firestore.runTransaction(async transaction => {
    const permissionsDoc = await transaction.get(permissionsRef)
    const permissions = permissionsDoc.data();
    const customClaims = {
      admin: permissions ? permissions.admin : false,
      hasAccess: permissions ? permissions.hasAccess : false,
    };

    transaction.set(userRef, { name: user.displayName, email: user.email, getEmails: customClaims.hasAccess })
    await admin.auth().setCustomUserClaims(user.uid, customClaims)
    transaction.update(tokenRef, { accountStatus: 'ready', refreshTime: admin.firestore.FieldValue.serverTimestamp() })
  });
})

exports.removeUserData = functions.auth.user().onDelete(async user => {
  await firestore.collection('users').doc(user.uid).delete()
  await firestore.collection('userTokens').doc(user.uid).delete()
})

// Sends a notification email when a new order is created
exports.sendOrderEmail = functions.firestore.document('orders/{orderId}').onCreate(async (snapshot, context) => {
  const data = snapshot.data()
  await sendOrderEmail(data)
})

async function getEmailsToNotify() {
  const results = await firestore.collection('users').where('getEmails', '==', true).get();
  return results.docs.map(user => `${user.get('name')} <${user.get('email')}>`).join(',');
}

// Sends an order email
async function sendOrderEmail({name, email, delivery, address, products}) {
  const emails = await getEmailsToNotify();

  const mailOptions = {
    from: `Grammy\'s Gluten Free Goodies <${functions.config().email.noreply}>`,
    to: `Undisclosed Recipients <${functions.config().email.noreply}>`,
    bcc: emails,
    subject: `New order from ${name}!`,
  }

  var emailText = `Name: ${name}
Email: ${email}
Delivery: ${delivery}`

  if (delivery === 'yes') {
    emailText = emailText.concat('\n', 'Address: ', address);
  }
  products.forEach(product => emailText = emailText.concat('\n', product.name, ': ', product.amount))
  mailOptions.text = emailText

  var emailHtml = `<b>Name:</b> ${name}<br/>
<b>Email:</b> ${email}<br/>
<b>Delivery:</b> ${delivery}`

  if (delivery === 'yes') {
    emailHtml = emailHtml.concat('<br/><b>', 'Address:</b> ', address);
  }
  products.forEach(product => emailHtml = emailHtml.concat('<br/><b>', product.name, ':</b> ', product.amount))
  mailOptions.html = emailHtml

  await mailTransport.sendMail(mailOptions)
  console.log('New order email sent.')
}

const orderApp = express()
orderApp.use(cors())
orderApp.post('/create', async (req, res) => {
  const data = req.body
  var order = {
    name: data.name,
    email: data.email,
    delivery: data.delivery,
    products: data.products,
    viewed: false,
    completed: false,
    date: admin.firestore.FieldValue.serverTimestamp(),
  }
  if (order.delivery === 'yes') {
    order.address = data.address
  }
  await firestore.collection('orders').add(order)
  res.json({type: 'success', message: 'Order created successfully.'})
})

exports.orders = functions.https.onRequest(orderApp)
