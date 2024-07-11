const Logger = require("./Logger");

const Mail = async (email, html, subject) => {

  try {

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html,
    };

    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        Logger.error(
          "There was an error sending the email on line 43 //There's some extra stuff \n\n\n" +
          info.line,
          error,
        );
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