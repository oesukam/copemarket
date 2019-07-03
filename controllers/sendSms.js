const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const phone = process.env.TWILIO_PHONE
const client = require('twilio')(accountSid, authToken)

exports.sendMessage = ({ from = '', to = '', message = ''} = {}) => {
  return new Promise((resolve, reject) => {
    if (!message || !to) {
      reject(new Error('All field required'))
    }
    client.messages
      .create({
        body: message,
        from: from || phone,
        to: to
      })
      .then(message => resolve(message))
      .done();
  })
}
