const pug = require("pug");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const { convert } = require("html-to-text");

const environment = process.env.NODE_ENV;
console.log(environment);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Sonu Acharya <${process.env.EMAIL_FROM}>`;
  }

  newTransporter() {
    return mg;
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html, {
        wordwrap: 130,
      }),
    };

    await this.newTransporter().messages.create(
      process.env.MAILGUN_DOMAIN,
      mailOptions
    );
  }

  async sendWelcome() {
    await this.send("Welcome", "Welcome to the Adventure Gate Family");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
