const nodemailer = require("nodemailer")
const Logger = require("./Logger");


const Mail = async (email, html, subject) => {

  try {

    let transporter = nodemailer.createTransport({
      host: 'isaac0yen.com',
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS // Use the email account's password
      }
    }); 

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html,
    };

    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
      }
      return true;
    });

  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  Mail
};