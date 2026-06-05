const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendBookingConfirmation = async (user, booking, car) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Booking Confirmation - ${booking.bookingId}`,
    html: `
      <h2>Booking Confirmation</h2>
      <p>Dear ${user.firstName},</p>
      <p>Your booking has been confirmed!</p>
      <h3>Booking Details</h3>
      <ul>
        <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
        <li><strong>Car:</strong> ${car.year} ${car.make} ${car.model}</li>
        <li><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleDateString()}</li>
        <li><strong>Return Date:</strong> ${new Date(booking.returnDate).toLocaleDateString()}</li>
        <li><strong>Total Cost:</strong> $${booking.totalCost}</li>
      </ul>
      <p>Thank you for choosing us!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

const sendReminderEmail = async (user, booking, car) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Reminder: Your rental is on ${new Date(booking.pickupDate).toLocaleDateString()}`,
    html: `
      <h2>Rental Reminder</h2>
      <p>Dear ${user.firstName},</p>
      <p>This is a reminder about your upcoming rental.</p>
      <h3>Details</h3>
      <ul>
        <li><strong>Booking ID:</strong> ${booking.bookingId}</li>
        <li><strong>Car:</strong> ${car.year} ${car.make} ${car.model}</li>
        <li><strong>Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleDateString()}</li>
        <li><strong>Pickup Location:</strong> ${booking.pickupLocation}</li>
      </ul>
      <p>Please arrive 15 minutes early.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

const sendPaymentReceipt = async (user, payment, booking) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Payment Receipt - ${booking.bookingId}`,
    html: `
      <h2>Payment Receipt</h2>
      <p>Dear ${user.firstName},</p>
      <p>Your payment has been processed successfully.</p>
      <h3>Payment Details</h3>
      <ul>
        <li><strong>Transaction ID:</strong> ${payment.transactionId}</li>
        <li><strong>Amount:</strong> $${payment.amount}</li>
        <li><strong>Status:</strong> ${payment.status}</li>
        <li><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleDateString()}</li>
      </ul>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendReminderEmail,
  sendPaymentReceipt
};
