const admin = require('firebase-admin');
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

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

exports.assignUserClaims = functions.auth.user().onCreate(async (user) => {
  if (user.emailVerified) {
    const userPermissions = (await firestore.collection('userPermissions').doc(user.email).get()).data;
    if (userPermissions) {
      const customClaims = {
        admin: userPermissions.admin,
        hasAccess: userPermissions.hasAccess,
        getEmails: userPermissions.getEmails,
      };

      return admin.auth().setCustomUserClaims(user.uid, customClaims)
        .catch(error => {
          console.log(error);
        })
    }
  }

  return false;
})

// Sends a notification email when a new order is created
exports.sendOrderEmail = functions.firestore.document('orders/{orderId}').onCreate((snapshot, context) => {
  const data = snapshot.data();
  console.log(data);
  return sendOrderEmail(data);
})

async function getEmailsToNotify() {
  const userList = await admin.auth().listUsers();
  return userList.users.filter(user => user.customClaims.getEmails == true).map(user => `${user.displayName} <${user.email}>`);
}

// Sends an order email
function sendOrderEmail({name, email, delivery, address, products}) {
  const mailOptions = {
    from: `Grammy\'s Gluten Free Goodies <${functions.config().email.noreply}>`,
    to: `Undisclosed Recipients <${functions.config().email.noreply}>`,
    bcc: getEmailsToNotify().join(','),
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

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('New order email sent.');
  })
}

const express = require('express')
const cors = require('cors')

const orderApp = express()

orderApp.use(cors())

orderApp.post('/create', (req, res) => {
  const data = req.body
  var order = {
    name: data.name,
    email: data.email,
    delivery: data.delivery,
    products: data.products,
    viewed: false,
    completed: false,
    date: admin.firestore.Timestamp.now(),
  }
  if (order.delivery === 'yes') {
    order.address = data.address
  }
  firestore.collection('orders').add(order).then(() => res.json({type: 'success', message: 'Order created successfully.'}))
})

exports.orders = functions.https.onRequest(orderApp)
