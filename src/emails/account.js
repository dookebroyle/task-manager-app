const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'doyle_brooke@hotmail.com',
        subject: 'Welcome!',
        text: `Welcome to your new task manager, ${name}. Let me know how you like the app.`
    })
}

const sendCancelEmail = (email, name) => {
    try{
        sgMail.send({
        to: email,
        from: 'doyle_brooke@hotmail.com',
        subject: `Goodbye!`,
        text: `We're sorry to see you go. Please let us know if there's anything we could have done better. Your feedback is very important to us!`
    })}
    catch (e) {
        throw new Error(`Unable to send email to ${email}`)
    }
}


module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}