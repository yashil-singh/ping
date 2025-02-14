import { emailTemplateMain } from "./components";
import { MUTED_TEXT_COLOR, PRIMARY_COLOR } from "./styles";

const emailVerificationTemplate = (code: string, verifyAccountLink: string) => {
  return `
    ${emailTemplateMain({
      title: "You are almost there!",
      description: `Only one step left to join us at Ping. To complete your profile and start pinging, you'll need to verify your email. Use the following verification code or click the button below to verify.`,
      body: `
        <div style="padding: 2rem 0; display: grid;">
            <div style="background-color: ${PRIMARY_COLOR}; padding: 1.5rem; margin-bottom: 0.5rem;">
                <h1 style="text-align: center; font-size: 42px; margin: 0; color: white">
                ${code}
                </h1>
            </div>
            
            <p style="margin: 0; text-align: center; font-weight: 600">
                This code is valid for the next 15 minutes.
            </p>
            
            <div style="margin: 2rem 0; display: flex;">
                <a href="${verifyAccountLink}"
                style="
                    display: inline-block;
                    padding: 12px 24px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: ${PRIMARY_COLOR};
                    text-decoration: none;
                    border-radius: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                    margin: auto;
                "
                target="_blank"
                >
                    Verify Account
                </a>
            </div>
            
            <p style="text-align: center; margin: 0; color: ${MUTED_TEXT_COLOR}">
                If you did not request this code, please ignore this email.
            </p>
        </div>
      `,
    })}
    `;
};

export default emailVerificationTemplate;
