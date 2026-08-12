import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import apiRequest from '../../lib/apiRequest';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState(token ? 'verifying' : 'idle'); // idle, verifying, success, error
  const [email, setEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('');

  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  const verifyToken = async (tokenStr) => {
    try {
      await apiRequest.get(`/auth/verify-email?token=${tokenStr}`);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) return;
    setResendStatus('sending');
    try {
      await apiRequest.post('/auth/resend-verification', { email });
      setResendStatus('sent');
    } catch (err) {
      setResendStatus('error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center py-12 px-4 bg-surface-50">
      <div className="w-full max-w-md bg-white rounded-card shadow-elevated p-8">
        <h1 className="font-heading text-display-sm text-navy-900 mb-4">Email Verification</h1>
        
        {status === 'verifying' && <p>Verifying your email, please wait...</p>}
        
        {status === 'success' && (
          <div>
            <p className="text-green-600 mb-4">Your email has been successfully verified!</p>
            <Link to="/login" className="btn-primary w-full inline-block text-center !py-3">
              Go to Login
            </Link>
          </div>
        )}

        {(status === 'error' || status === 'idle') && (
          <div>
            {status === 'error' && <p className="text-red-500 mb-4">Invalid or expired verification link.</p>}
            {status === 'idle' && <p className="text-navy-600 mb-4">Enter your email to request a new verification link.</p>}
            
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label className="label-text mb-1 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>
              <button disabled={resendStatus === 'sending'} className="btn-primary w-full !py-3">
                {resendStatus === 'sending' ? 'Sending...' : 'Resend Verification Email'}
              </button>
              {resendStatus === 'sent' && <p className="text-green-600 text-sm mt-2">Verification email sent! Check your inbox.</p>}
              {resendStatus === 'error' && <p className="text-red-500 text-sm mt-2">Failed to send email. Ensure the email is correct and not already verified.</p>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
