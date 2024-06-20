const nodemailer = require("nodemailer");

const senderMail = process.env.OTP_SENDER_MAIL;
const password = process.env.PASSWORD;

const sendOtp = async (otp, receiverMail) => {
  const html = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

</head>

<body>

    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
            <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Internshala</a>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Thank you for choosing Internshala. Use the following OTP to complete your payment procedures. OTP is
                valid for 5 minutes</p>
            <h2
                style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
                ${otp}</h2>
            <p style="font-size:0.9em;">Regards,<br />Internshala</p>
            <hr style="border:none;border-top:1px solid #eee" />
            <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Internshala Inc</p>
                <p>Berhampore, West Bengal</p>
                <p>India</p>
            </div>
        </div>
    </div>

</body>

</html>
  `;
  const subject = "Confirm your one time password";
  await sendMail(receiverMail, subject, null, html, null);
};

const sendInvoice = (receiverEmail, invoice) => {
  const subject = "Invoice";
  const text = "Hi dear here is your invoice";
  const attachments = [
    {
      filename: invoice.filename,
      path: invoice.path,
    },
  ];
  sendMail(receiverEmail, subject, text, null, attachments);
};

const sendMail = async (receiverMail, subject, text, html, attachments) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: senderMail,
      pass: password,
    },
  });

  const mailOptions = {
    from: senderMail,
    to: receiverMail,
    subject: subject,
    text: text,
    html: html,
    attachments: attachments,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtp, sendInvoice };
