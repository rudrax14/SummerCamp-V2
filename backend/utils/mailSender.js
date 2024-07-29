const nodemailer = require("nodemailer")
require("dotenv").config()

const mailSender = async (email, title, body) => {
    var mailConfig;
    if (process.env.NODE_ENV === "production") {
        mailConfig = {
            service: "Gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        }
    } else {
        mailConfig = {
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            }
        };
    }


    try {
        const transporter = nodemailer.createTransport(mailConfig);

        const info = await transporter.sendMail({
            from: 'Summer-Camp',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log("Mail sent successfully");
        console.log(info);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    } catch (err) {
        console.log("unable to send mail");
        console.log(err);
    }
}

module.exports = mailSender;