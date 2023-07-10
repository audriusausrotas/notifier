export default function messageTemplate(code) {
  const htmlTemplate = `
    <style>
      .container {
        background-color: white;
        padding: 20px;
        text-align: center;
        margin-top: 100px;
      }

      .header{
        font-size: 50px;
        font-weight: bold;
      }

      .code{
        text-align: center;
        font-size: 35px;
        font-weight: bold;
      }

    </style>
    <div class="container">
      <h1 class="header">
        Notifier
      </h1>
      <h3>
        If you have not requested a password reset , we strongly advise changing your password immediately to protect your account.
      </h3>
      <h3>
        Please use the following code to proceed with the account verification process.
      </h3>
      <h2 class="code">
        ${code}
      </h2>
    </div>
        `;

  return htmlTemplate;
}
