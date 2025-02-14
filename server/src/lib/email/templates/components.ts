import { LOGO_LINK, MAIL_USER } from "../../env";
import { BACKGROUND_COLOR, CARD_STYLE } from "./styles";

export const emailTemplateLogo = (size: number = 40) => `
    <img style="margin: 0 auto; object-fit: contain; height: ${size}px" alt="ping-logo" src="${LOGO_LINK}" />
`;

export const emailTemplateMain = ({
  title,
  description,
  body,
}: {
  title: string;
  description?: string;
  body: string;
}) => `
<!DOCTYPE html>
<html lang="en">
    <body style="
        padding: 1.5rem; 
        background-color: ${BACKGROUND_COLOR};
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        display: grid;
    ">
        <div style="${CARD_STYLE} margin-bottom: 1rem">
            <div style="padding: 2rem 2rem 0 2rem;">
                <h1 style="font-size: 2rem; margin: 0;">
                    ${title}
                </h1>
                ${description && `<p style="margin: 0">${description}</p>`}
            </div>
            
            ${body}
        </div>
        
        <div style="${CARD_STYLE} padding: 1rem 0; margin-bottom: 0.5rem;">
            <p style="text-align: center; margin: 0">Having trouble logging in? Please <a href="mailto:${MAIL_USER}">contact us</a>.</p>
        </div>
        
        <div style="max-width: 200px; margin: 0 auto;">
            ${emailTemplateLogo()}
        </div>
    </body>
</html>
`;
