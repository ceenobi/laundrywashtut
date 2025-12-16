export const welcomeTemplate = (fullname, verificationLink) => `
      <!DOCTYPE html>
      <html>
      <head>
              <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
            .content { padding: 10px; }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color:rgb(41, 48, 171);
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 15px 0;
            }
            p{
                font-size: 14px;
            }
            a {
                color: white;
                text-decoration: none;
            }
            .footer { 
                margin-top: 20px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
        </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1 style="font-weight: bold; font-size: 24px; text-align: center;">Welcome to LaundryWash</h1>
              </div>
              <div class="content">
                  <h1><strong>Hello ${fullname}</strong></h1>
                  <p>Thank you for registering with us. We're very excited to have you on board!</p>
                  <p>To get started, please verify your email address with the link below:</p>
                  <a href="${verificationLink}" style="font-weight: bold; font-size: 20px; color: #4a90e2;">${verificationLink}</a>
                  <p>This link will expire in 1 hour.</p>
              </div>
              <div class="footer">
                  <p>© ${new Date().getFullYear()} LaundryWash - Glad to have you!. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `;

export const resetPasswordTemplate = (fullname, passwordLink) => `
      <!DOCTYPE html>
      <html>
      <head>
              <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
            .content { padding: 10px; }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color:rgb(41, 48, 171);
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 15px 0;
            }
            p{
                font-size: 14px;
            }
            a {
                color: white;
                text-decoration: none;
            }
            .footer { 
                margin-top: 20px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
        </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1 style="font-weight: bold; font-size: 24px; text-align: center;">Reset Password</h1>
              </div>
              <div class="content">
                  <h1><strong>Hello ${fullname}</strong></h1>
                  <p>You have requested to reset your password, please follow the link below!</p>
                  <a href="${passwordLink}" style="font-weight: bold; font-size: 20px; color: #4a90e2;">${passwordLink}</a>
                  <p>This link will expire in 15 minutes. Do not share with anyone.</p>
              </div>
              <div class="footer">
                  <p>© ${new Date().getFullYear()} LaundryWash - Glad to have you!. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `;

export const bookingTemplate = (fullname, booking) => `
      <!DOCTYPE html>
      <html>
      <head>
              <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color:rgb(48, 44, 183); color: white; padding: 20px; text-align: center; }
            .content { padding: 10px; }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color:rgb(41, 48, 171);
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 15px 0;
            }
            p{
                font-size: 14px;
            }
            a {
                color: white;
                text-decoration: none;
            }
            .footer { 
                margin-top: 20px;
                font-size: 12px;
                color: #777;
                text-align: center;
            }
        </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1 style="font-weight: bold; font-size: 24px; text-align: center;">Booking Confirmation</h1>
              </div>
              <div class="content">
                  <h1><strong>Hello ${fullname}</strong></h1>
                  <p>We have received your bookings</p>
                   <p>Service type: <strong>${booking.serviceType}</strong></p>
                  <p>We will pick up the items at the scheduled pick date ${
                    booking.pickUp.date
                  } ${booking.pickUp.time}.</p>
                  <p>You will be informed if there's a change in pick date.</p>
                  <p>Thank you for choosing us.</p>
              </div>
              <div class="footer">
                  <p>© ${new Date().getFullYear()} LaundryWash - Glad to have you!. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `;
