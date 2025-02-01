import { CLIENT_BASE_URL } from "./contants";

const PRIMARY_COLOR = "#82a3d4";
const PRIMARY_ACCENT_COLOR = "#d9e3f2";

export const verficationTokenEmailTemplate = (verificationCode: number) => {
  return `<html lang="en">
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Verification Code</title>
     <style>
       body {
         background-color: #f4f7fc;
         margin: 0;
         padding: 0;
       }
 
       .container {
         max-width: 600px;
         margin: 20px auto;
         background-color: #ffffff;
         padding: 20px;
         border-radius: 8px;
         box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
       }
 
       .header {
         text-align: center;
         margin-bottom: 20px;
       }
 
       h1 {
         font-size: 24px;
         color: #333;
         margin-bottom: 10px;
       }
 
       .code {
         display: inline-block;
         font-size: 32px;
         font-weight: bold;
         color: ${PRIMARY_COLOR};
         padding: 10px 20px;
         border-radius: 6px;
         background-color: ${PRIMARY_ACCENT_COLOR};
         margin: 0px auto;
       }
 
       .instructions {
         margin-top: 20px;
         font-size: 16px;
         color: #555;
       }
 
       .footer {
         text-align: center;
         margin-top: 40px;
         font-size: 12px;
         color: #aaa;
       }
 
       .footer a {
         color: ${PRIMARY_COLOR};
         text-decoration: none;
       }
     </style>
   </head>
   <body>
     <div class="container">
       <div class="header">
         <h1>Welcome to Ping!</h1>
         <p>We are excited to have you with us. To complete your registration, please use the verification code below:</p>
       </div>
 
        <div style="display: flex; justify-content: center">
          <div class="code">${verificationCode}</div>
        </div>
 
       <div class="instructions">
         <p>This verification code is valid for 15 minutes. Enter it on the verify account page to complete your account setup.</p>
         <p>If you did not request this code, please ignore this email.</p>
       </div>
 
       <div class="footer">
         <p>Thank you for choosing Ping!</p>
         <p><a href="${CLIENT_BASE_URL}">Visit our website</a></p>
       </div>
     </div>
   </body>
 </html>`;
};

export const verficationCompletedEmailTemplate = (username: string) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account verification compelted</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f7fc;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
      }

      .header {
        text-align: center;
        padding-bottom: 10px;
        border-bottom: 2px solid ${PRIMARY_COLOR};
      }

      h1 {
        font-size: 24px;
        color: #333;
        margin-bottom: 10px;
      }
        
      .message {
        font-size: 18px;
        color: #555;
        margin-top: 20px;
      }

      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 24px;
        font-size: 16px;
        color: #ffffff;
        background-color: ${PRIMARY_COLOR};
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }

      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #aaa;
      }

      .footer a {
        color: ${PRIMARY_COLOR};
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🎉 Congratulations!</h1>
      </div>

      <p class="message">
        Your account has been successfully verified. You can now start using all the features of Ping! We are happy to have you onboard <span style="font-weight: 600;">${username}.</span>
      </p>

      <div class="footer">
        <p>Thank you for choosing Ping! 🚀</p>
        <p>
          If you have any questions, feel free to <a href="mailto:support@ping.com">contact us</a>.
        </p>
      </div>
    </div>
  </body>
</html>`;
};

export const passwordResetEmailTemplate = (
  username: string,
  resetLink: string
) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Account verification compelted</title>
    <style>
      body {
        background-color: #f4f7fc;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 1rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .header {
        text-align: center;
        padding-bottom: 10px;
        border-bottom: 2px solid ${PRIMARY_COLOR};
      }

      h1 {
        font-size: 24px;
        color: #333;
        margin-bottom: 10px;
      }

      .message {
        font-size: 18px;
        color: #555;
        margin-top: 20px;
      }

      .container a {
        display: inline-block;
        margin-top: 20px;
        margin-bottom: 20px;
        padding: 12px 24px;
        font-size: 16px;
        color: ${PRIMARY_COLOR};
        background-color: ${PRIMARY_ACCENT_COLOR};
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }

      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #aaa;
      }

      .footer p {
        margin: 0;
      }

      .footer a {
        color: "${PRIMARY_COLOR}";
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>

      <p>Hi <span style="font-weight: 700">${username}</span>,</p>
      <p>
        We received a request to reset your password. You can reset it by
        clicking the button below:
      </p>
      <div style="display: flex; align-items: center; justify-content: center !important">
        <a href="${resetLink}" class="button">Reset Your Password</a>
      </div>
      <p>
        If you didn’t request a password reset, please ignore this email, and
        your password will remain unchanged.
      </p>
      <p>
        If you have any issues or questions, feel free to contact our support
        team.
      </p>

      <div class="footer">
        <p>Thanks,</p>
        <p>The Ping Team</p>
      </div>
    </div>
  </body>
</html>`;
};
