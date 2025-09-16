const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const { render } = require('@react-email/render');
const { GeneralEmail } = require('./templates/generalEmail');
const { ActivationEmail } = require('./templates/activationEmail')
const { PasswordResetEmail } = require('./templates/passwordResetEmail')
const { AccountDeletionEmail } = require('./templates/accountDeletionEmail')
const { ContactConfirmationEmail } = require('./templates/contactConfirmationEmail')
const { ContactInternalEmail } = require('./templates/contactInternalEmail')
const { WelcomeEmail } = require('./templates/welcomeEmail')

const ses = new SESClient({ region: "eu-west-1" });

exports.handler = async (event) => {
    console.log(event)
    const body = event;
    const templateName = body.templateName;
    const parameters = body.parameters;
    const fromEmail = body.fromEmail;
    const toEmails = body.toEmails;
    //
    var subject = null
    var html = null
    switch (templateName) {
        case "accountActivation":
            subject = 'Account Activation'
            html = render(
                GeneralEmail({
                    BodyEmailComponent: ActivationEmail,
                    parameters: parameters
                }),
                {
                    pretty: true,
                }
            );
            break;
        case "passwordReset":
            subject = 'Password Reset'
            html = render(
                GeneralEmail({
                    BodyEmailComponent: PasswordResetEmail,
                    parameters: parameters
                }),
                {
                    pretty: true,
                }
            );
            break;
        case "userContactInternal":
            subject = 'User Contact'
            html = render(
                GeneralEmail({
                    BodyEmailComponent: ContactInternalEmail,
                    parameters: parameters
                }),
                {
                    pretty: true,
                }
            );
            break;
        case "userContactConfirmation":
            subject = 'Contact Confirmation'
            html = render(
                GeneralEmail({
                    BodyEmailComponent: ContactConfirmationEmail,
                    parameters: parameters
                }),
                {
                    pretty: true,
                }
            );
            break;
        case "welcomeAboard":
            subject = 'Welcome aboard!'
            html = render(
                GeneralEmail({
                    BodyEmailComponent: WelcomeEmail,
                    parameters: parameters
                }),
                {
                    pretty: true,
                }
            );
            break;
        case "accountDeletion":
            subject = 'Account Deletion'
            html = render(
                GeneralEmail({
                    BodyEmailComponent: AccountDeletionEmail,
                    parameters: parameters
                }),
                {
                    pretty: true,
                }
            );
            break;
    };

    const command = new SendEmailCommand({
        Destination: {
            ToAddresses: [...toEmails],
        },
        Message: {
            Body: {
                Html: { Data: html },
            },
            Subject: { Data: subject },
        },
        Source: fromEmail,
    });

    try {
        let response = await ses.send(command);
        console.log('Email sent');
        return response;
    } catch (error) {
        console.error('Error sending email:', error);
        return { statusCode: 500, body: JSON.stringify('Error sending email') };
    }
};
