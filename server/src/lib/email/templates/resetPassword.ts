import { emailTemplateMain } from "./components";
import { PRIMARY_COLOR } from "./styles";

const resetPasswordTemplate = (resetPasswordLink: string) => `
    ${emailTemplateMain({
      title: "Password Reset Request",
      description:
        "We received a request to reset your password. You can reset it by clicking the button below:",
      body: `
        <div style="padding: 2rem; display: grid;">
            <div style="margin: 2rem 0; display: flex;">
                <a href="${resetPasswordLink}"
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
                    Reset Password
                </a>
            </div>
            
            <p style="margin: 0; text-align: center; font-weight: 600">
                This link is valid for the next 15 minutes.
            </p>
            
            <p>
                If you didn’t request a password reset, please ignore this email, and
                your password will remain unchanged.
            </p>
        </div>
    `,
    })}
`;

export default resetPasswordTemplate;
