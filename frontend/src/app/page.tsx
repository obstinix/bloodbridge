'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'donor' | 'hospital' | 'admin'>('donor');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regBloodGroup, setRegBloodGroup] = useState('O+');
  const [regContact, setRegContact] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Public stats
  const [stats, setStats] = useState({
    donorsCount: 142,
    hospitalsCount: 18,
    activeRequests: 5,
    bloodInventory: [] as { blood_group: string; quantity: number }[]
  });

  useEffect(() => {
    // Clear alerts on tab switch or mode change
    setErrorMessage('');
    setSuccessMessage('');
  }, [activeTab, isRegistering]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          user_type: activeTab
        })
      });

      const data = await response.json();
      if (data.success) {
        // Save token and info to localStorage
        localStorage.setItem('bb_token', data.token);
        localStorage.setItem('bb_role', data.role);
        localStorage.setItem('bb_name', data.name);
        localStorage.setItem('bb_username', username);
        if (data.role === 'donor') {
          localStorage.setItem('bb_donor_id', data.donor_id?.toString() || '');
          localStorage.setItem('bb_blood_group', data.blood_group || '');
          localStorage.setItem('bb_contact', data.contact || '');
        }
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Could not connect to the backend server. Make sure your Flask backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    try {
      // Direct post to Flask registration endpoint or API
      const response = await fetch('http://localhost:5000/register_donor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: regName,
          age: regAge,
          gender: regGender,
          blood_group: regBloodGroup,
          contact: regContact,
          address: regAddress,
          password: regPassword,
          confirm_password: regConfirmPassword
        })
      });

      // The standard endpoint redirects on success, let's handle HTML response or simple status
      if (response.ok) {
        setSuccessMessage('Registration successful! You can now log in.');
        setIsRegistering(false);
        setUsername(regContact);
        setPassword('');
        // Clear reg form
        setRegName('');
        setRegAge('');
        setRegContact('');
        setRegAddress('');
        setRegPassword('');
        setRegConfirmPassword('');
      } else {
        setErrorMessage('Registration failed. Contact number may already be registered.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Premium Header */}
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <svg style={{ width: '48px', height: '48px', fill: 'var(--primary)' }} viewBox="0 0 24 24">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            <path fill="rgba(255,255,255,0.4)" d="M12 5.5l3.54 3.54a5 5 0 1 1-7.07 0z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff 30%, var(--primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>
            BloodBridge
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 400, maxWidth: '500px', marginTop: '0.25rem' }}>
          Connecting Life, One Drop at a Time. A premium decentralized healthcare supply coordinator.
        </p>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        {/* Left Side: Stats and Info */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--primary)', fontSize: '1.75rem' }}>♥</span> Quick Metrics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.donorsCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Donors</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--info)' }}>{stats.hospitalsCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Hospitals</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: 'var(--border-radius-md)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{stats.activeRequests}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Active Req</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'white' }}>Why Choose BloodBridge?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(229, 57, 70, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0, fontWeight: 700 }}>1</div>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '0.2rem' }}>Real-time Supply Tracking</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Hospitals can instantly see what blood groups are available in the repository before making requests.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)', flexShrink: 0, fontWeight: 700 }}>2</div>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '0.2rem' }}>JWT-Secured Restful Endpoints</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enterprise-level security using JSON Web Tokens ensures only vetted entities can schedule or modify donations.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', flexShrink: 0, fontWeight: 700 }}>3</div>
                <div>
                  <h4 style={{ color: 'white', marginBottom: '0.2rem' }}>Bcrypt-Hashed Accounts</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Passwords are cryptographically secured using blowfish salts with brute-force rate limiters.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Tabbed Interactive Form */}
        <section className="glass-panel glass-panel-glow" style={{ padding: '2.5rem 2rem' }}>
          {!isRegistering ? (
            // LOGIN SECTION
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.75rem', color: 'white', marginBottom: '0.5rem' }}>Vetted Portal</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Select your authenticated profile role below</p>
              </div>

              {/* Glass Tabs */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--glass-border)' }}>
                {(['donor', 'hospital', 'admin'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveTab(role)}
                    style={{
                      flex: 1,
                      background: activeTab === role ? 'rgba(255,255,255,0.06)' : 'transparent',
                      color: activeTab === role ? 'white' : 'var(--text-secondary)',
                      border: 'none',
                      padding: '0.6rem 0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {errorMessage && (
                <div className="glass-badge badge-danger" style={{ display: 'flex', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-md)', width: '100%' }}>
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="glass-badge badge-success" style={{ display: 'flex', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-md)', width: '100%' }}>
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">
                    {activeTab === 'admin' ? 'Username' : activeTab === 'donor' ? 'Contact / Phone' : 'Hospital Code / Contact'}
                  </label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    placeholder={activeTab === 'admin' ? 'e.g. admin' : activeTab === 'donor' ? 'e.g. 1234567890' : 'e.g. 555-0101'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="glass-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                  {loading ? 'Authenticating...' : 'Access Account'}
                </button>
              </form>

              {activeTab === 'donor' && (
                <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>New to BloodBridge? </span>
                  <button
                    onClick={() => setIsRegistering(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
                  >
                    Register as Donor
                  </button>
                </div>
              )}
            </div>
          ) : (
            // REGISTRATION SECTION
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.75rem', color: 'white', marginBottom: '0.25rem' }}>Join the Network</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Submit your medical profiling details</p>
              </div>

              {errorMessage && (
                <div className="glass-badge badge-danger" style={{ display: 'flex', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-md)', width: '100%' }}>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    placeholder="Jane Doe"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="65"
                      className="glass-input"
                      placeholder="e.g. 28"
                      value={regAge}
                      onChange={(e) => setRegAge(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select
                      className="glass-input glass-select"
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Blood Group *</label>
                    <select
                      className="glass-input glass-select"
                      value={regBloodGroup}
                      onChange={(e) => setRegBloodGroup(e.target.value)}
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact / Phone *</label>
                    <input
                      type="tel"
                      required
                      className="glass-input"
                      placeholder="e.g. 1234567890"
                      value={regContact}
                      onChange={(e) => setRegContact(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Residential Address *</label>
                  <input
                    type="text"
                    required
                    className="glass-input"
                    placeholder="123 Main St, New York"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      required
                      className="glass-input"
                      placeholder="Min 8 chars"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      className="glass-input"
                      placeholder="Repeat"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                  {loading ? 'Submitting Registry...' : 'Register Profile'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Already registered? </span>
                <button
                  onClick={() => setIsRegistering(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'underline' }}
                >
                  Log In instead
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
