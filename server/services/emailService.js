const { BrevoClient } = require("@getbrevo/brevo")

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
})

async function sendEmail({ to, subject, html }) {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    })

    return response
  } catch (error) {
    console.error("Brevo email error:", error)
    throw error
  }
}

module.exports = {
  sendEmail,
}