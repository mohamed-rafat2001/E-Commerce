export const passwordResetCodeTemplate = (
	resetCode,
	userName,
	expiryMinutes = 10
) => {
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Code</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          color: black;
        }
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header p {
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #333;
        }
        .message {
          font-size: 16px;
          margin-bottom: 30px;
          color: #666;
        }
        .code-container {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
          box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
        }
        .code-label {
          color: black;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
        }
        .reset-code {
          font-size: 36px;
          font-weight: bold;
          color: black;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .expiry-info {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          text-align: center;
        }
        .expiry-info .icon {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .expiry-text {
          color: #856404;
          font-weight: 600;
          font-size: 14px;
        }
        .instructions {
          background-color: #f8f9fa;
          border-left: 4px solid #007bff;
          padding: 20px;
          margin: 25px 0;
        }
        .instructions h3 {
          color: #007bff;
          margin-bottom: 15px;
          font-size: 16px;
        }
        .instructions ol {
          margin-left: 20px;
          color: #666;
        }
        .instructions li {
          margin-bottom: 8px;
        }
        .security-notice {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        .security-notice h4 {
          color: #721c24;
          margin-bottom: 10px;
          font-size: 16px;
        }
        .security-notice ul {
          margin-left: 20px;
          color: #721c24;
        }
        .security-notice li {
          margin-bottom: 5px;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #dee2e6;
        }
        .footer p {
          color: #6c757d;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .support-link {
          color: #007bff;
          text-decoration: none;
          font-weight: 600;
        }
        .support-link:hover {
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .email-container {
            margin: 0;
            box-shadow: none;
          }
          .header, .content, .footer {
            padding: 20px;
          }
          .reset-code {
            font-size: 28px;
            letter-spacing: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🔐 Password Reset</h1>
          <p>Secure access to your account</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${userName || "Valued Customer"},
          </div>
          
          <div class="message">
            We received a request to reset your password. Use the verification code below to proceed with resetting your password.
          </div>
          
          <div class="code-container">
            <div class="code-label">Your Reset Code</div>
            <div class="reset-code">${resetCode}</div>
          </div>
          
          <div class="expiry-info">
            <div class="icon">⏰</div>
            <div class="expiry-text">
              This code will expire in ${expiryMinutes} minutes
            </div>
          </div>
          
          <div class="instructions">
            <h3>📋 How to use this code:</h3>
            <ol>
              <li>Go back to the password reset page</li>
              <li>Enter the 6-digit code above</li>
              <li>Create your new secure password</li>
              <li>Confirm your new password</li>
            </ol>
          </div>
          
          <div class="security-notice">
            <h4>🛡️ Security Notice:</h4>
            <ul>
              <li>Never share this code with anyone</li>
              <li>Our team will never ask for this code</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Consider enabling two-factor authentication for better security</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>Need help? Contact our support team</p>
          <p>
            <a href="mailto:support@yourstore.com" class="support-link">mohamed20rafat@gmail.com</a> | 
            <a href="tel:+1234567890" class="support-link">+201050330514</a>
          </p>
          <p>© ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
