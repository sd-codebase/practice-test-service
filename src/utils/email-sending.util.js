var nodemailer = require('nodemailer');

export const sendMail = (template, mailId, otp, subject) => {
    const mailOptions = {
        from: 'noreply.kslabscare@gmail.com',
        to: mailId,
        subject: subject,
        html: otpTemplates[template] + '<h4>Use OTP: ' + otp + '</h4>'
    };

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'noreply.kslabscare@gmail.com',
          pass: 'comm@busi123'
        }
    });

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to ${mailId} :` + info.response);
        }
    });
}

const otpTemplates = {
'Account Verification' : `
    <h1>OTP for verification</h1>
    <h4>Please use this otp to verify your account</h4>
    <ul>
        <li> Login to the application (ignore if already logged in)</li>
        <li> Click on left-top humberger icon</li>
        <li> Go to verify account</li>
        <li> Enter OTP </li>
        <li> Click on sumbit</li>
    </ul>
`, 
'Forgot Password' : `
    <h1>OTP to Recover Password</h1>
    <h4>Please use this otp to reset your password</h4>
`};
