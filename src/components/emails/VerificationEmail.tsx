
interface EmailProps {
  username: string;
  otp: string;
}

const VerificationEmail: React.FC<EmailProps> = ({ username, otp }) => {
  return (
    <div className="font-sans text-gray-800">
      <h1 className="text-2xl font-bold text-green-500">OTP Verification</h1>
      <p>Dear {username},</p>
      <p>
        Thank you for signing up. To complete your registration, please use the following One Time Password (OTP):
      </p>
      <div className="inline-block px-6 py-3 my-4 text-xl font-bold bg-gray-100 rounded-lg">
        {otp}
      </div>
      <p>
        Please do not share this OTP with anyone. It is valid for a limited time only.
      </p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,</p>
      <p>The Music Academy Team</p>
    </div>
  );
};

export default  VerificationEmail;