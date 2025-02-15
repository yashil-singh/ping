import { emailTemplateMain } from "./components";

const emailVerifiedTemplate = (username: string) => `
    ${emailTemplateMain({
      title:
        'Account Activated! <span style="font-size: 1rem; margin-bottom: 15px">🟢</span>',
      description: "",
      body: `
        <div style="padding: 2rem; display: grid;">
            <img alt="email-success" src="https://cdn-icons-png.flaticon.com/512/4630/4630926.png" style="object-fit: contain; max-width: 100px; margin: 2rem auto" />
            
            <h1 style="font-size: 18px; text-align: center">Welcome to Ping, <span style="font-weight: bold;">${username}</span></h1>
            
            <p style="margin-bottom: 1rem">
                Your account has been verified. You can now start using all the features of Ping. We are happy to have you oboard.
            </p>
            
            <p>Thank you for choosing Ping 🚀</p>
        </div>
    `,
    })}
`;

export default emailVerifiedTemplate;
