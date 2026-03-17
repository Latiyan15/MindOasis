import { useState } from 'react';
import { useUser } from '../context/UserContext';
import MoodAvatar from '../components/MoodAvatar';
import { User, Mail, Lock, Briefcase, Home, Shield, ChevronLeft, Eye, EyeOff, Check, X, Heart, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STYLES = [
  { id: 'classic', label: 'Classic', bg: 'rgba(251,207,232,0.3)' },
  { id: 'sporty', label: 'Sporty', bg: 'rgba(191,219,254,0.3)' },
  { id: 'elegant', label: 'Elegant', bg: 'rgba(254,215,170,0.3)' },
  { id: 'retro', label: 'Retro', bg: 'rgba(253,230,138,0.3)' },
  { id: 'kawaii', label: 'Kawaii', bg: 'rgba(233,213,255,0.3)' },
];

const OCCUPATIONS = [
  { id: 'student', label: 'Student' },
  { id: 'professional', label: 'Professional' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'artist', label: 'Artist' },
  { id: 'homemaker', label: 'Homemaker' },
  { id: 'other', label: 'Other' },
];

const ENVIRONMENTS = [
  { id: 'alone', label: 'Living Alone' },
  { id: 'family', label: 'With Family' },
  { id: 'roommates', label: 'With Roommates' },
];

const AGE_GROUPS = [
  { id: 'under18', label: 'Under 18' },
  { id: '18-24', label: '18-24' },
  { id: '25-34', label: '25-34' },
  { id: '35-44', label: '35-44' },
  { id: '45-54', label: '45-54' },
  { id: '55+', label: '55+' },
];

const STRESS_SOURCES = [
  { id: 'work', label: 'Work / Career' },
  { id: 'academic', label: 'Academic' },
  { id: 'financial', label: 'Financial' },
  { id: 'relationships', label: 'Relationships' },
  { id: 'health', label: 'Health' },
  { id: 'other', label: 'Other' },
];

const FAMILY_SUPPORT = [
  { id: 'supportive', label: 'Supportive' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'stressful', label: 'Stressful' },
];

function ProfileCard({ title, icon: Icon, children, editing, onEdit, onSave, onCancel }) {
  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-card-title-row">
          {Icon && <Icon size={18} className="profile-card-icon" />}
          <h3 className="profile-card-title">{title}</h3>
        </div>
        {!editing ? (
          <button className="profile-edit-btn" onClick={onEdit}>Edit</button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="profile-save-btn" onClick={onSave}><Check size={14} /> Save</button>
            <button className="profile-cancel-btn" onClick={onCancel}><X size={14} /></button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function PillSelector({ options, value, onChange }) {
  return (
    <div className="profile-pill-row">
      {options.map(opt => (
        <button
          key={opt.id}
          className={`profile-pill ${value === opt.id ? 'selected' : ''}`}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function Profile() {
  const { user, saveUser, triggerLogoutTransition } = useUser();
  const navigate = useNavigate();

  // Editing states per section
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editingAccount, setEditingAccount] = useState(false);
  const [editingContext, setEditingContext] = useState(false);
  const [editingFamily, setEditingFamily] = useState(false);

  // Logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Temp edit values
  const [tempAvatarStyle, setTempAvatarStyle] = useState(user?.avatarStyle || 'classic');
  const [tempName, setTempName] = useState(user?.name || '');
  const [tempPassword, setTempPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tempOccupation, setTempOccupation] = useState(user?.occupation || '');
  const [tempEnvironment, setTempEnvironment] = useState(user?.environment || '');
  const [tempAgeGroup, setTempAgeGroup] = useState(user?.ageGroup || '');
  const [tempStressSource, setTempStressSource] = useState(user?.stressSource || '');
  const [tempHousehold, setTempHousehold] = useState(user?.household || '');
  const [tempFamilySupport, setTempFamilySupport] = useState(user?.familySupport || '');

  const handleSaveAvatar = () => {
    saveUser({ avatarStyle: tempAvatarStyle });
    setEditingAvatar(false);
  };

  const handleSaveAccount = () => {
    const updates = {};
    if (tempName.trim()) updates.name = tempName.trim();
    if (tempPassword.length >= 6) {
      let hash = 0;
      for (let i = 0; i < tempPassword.length; i++) {
        const char = tempPassword.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      updates.passwordHash = hash.toString(36);
    }
    saveUser(updates);
    setTempPassword('');
    setEditingAccount(false);
  };

  const handleSaveContext = () => {
    saveUser({
      occupation: tempOccupation || user?.occupation,
      environment: tempEnvironment || user?.environment,
      ageGroup: tempAgeGroup || user?.ageGroup,
      stressSource: tempStressSource || user?.stressSource,
    });
    setEditingContext(false);
  };

  const handleSaveFamily = () => {
    saveUser({
      household: tempHousehold || user?.household,
      familySupport: tempFamilySupport || user?.familySupport,
    });
    setEditingFamily(false);
  };

  const cancelEdit = (section) => {
    if (section === 'avatar') {
      setTempAvatarStyle(user?.avatarStyle || 'classic');
      setEditingAvatar(false);
    } else if (section === 'account') {
      setTempName(user?.name || '');
      setTempPassword('');
      setEditingAccount(false);
    } else if (section === 'context') {
      setTempOccupation(user?.occupation || '');
      setTempEnvironment(user?.environment || '');
      setTempAgeGroup(user?.ageGroup || '');
      setTempStressSource(user?.stressSource || '');
      setEditingContext(false);
    } else if (section === 'family') {
      setTempHousehold(user?.household || '');
      setTempFamilySupport(user?.familySupport || '');
      setEditingFamily(false);
    }
  };

  const getLabel = (options, id) => options.find(o => o.id === id)?.label || '—';

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="profile-back-btn" onClick={() => navigate('/')}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="profile-page-title">My Wellness Profile</h1>
        <div style={{ width: 36 }} />
      </div>

      {/* ===== AVATAR SECTION ===== */}
      <ProfileCard
        title="Your Companion"
        icon={Heart}
        editing={editingAvatar}
        onEdit={() => setEditingAvatar(true)}
        onSave={handleSaveAvatar}
        onCancel={() => cancelEdit('avatar')}
      >
        {!editingAvatar ? (
          <div className="profile-avatar-display">
            <div className="profile-avatar-circle">
              <MoodAvatar character={user?.avatarCharacter} avatarStyle={user?.avatarStyle} mood="Happy" size={72} />
            </div>
            <span className="profile-avatar-label">{getLabel(STYLES, user?.avatarStyle || 'classic')}</span>
          </div>
        ) : (
          <div className="profile-avatar-grid">
            {STYLES.map(styleOpt => (
              <button
                key={styleOpt.id}
                className={`profile-avatar-card ${tempAvatarStyle === styleOpt.id ? 'selected' : ''}`}
                onClick={() => setTempAvatarStyle(styleOpt.id)}
              >
                <div className="profile-avatar-card-circle" style={{ background: styleOpt.bg }}>
                  <MoodAvatar character={user?.avatarCharacter} avatarStyle={styleOpt.id} mood="Happy" size={44} />
                </div>
                <span>{styleOpt.label}</span>
              </button>
            ))}
          </div>
        )}
      </ProfileCard>

      {/* ===== ACCOUNT SECTION ===== */}
      <ProfileCard
        title="Account Information"
        icon={User}
        editing={editingAccount}
        onEdit={() => setEditingAccount(true)}
        onSave={handleSaveAccount}
        onCancel={() => cancelEdit('account')}
      >
        {!editingAccount ? (
          <div className="profile-info-list">
            <div className="profile-info-row">
              <Mail size={15} className="profile-info-icon" />
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{user?.email || '—'}</span>
            </div>
            <div className="profile-info-row">
              <User size={15} className="profile-info-icon" />
              <span className="profile-info-label">Name</span>
              <span className="profile-info-value">{user?.name || '—'}</span>
            </div>
            <div className="profile-info-row">
              <Lock size={15} className="profile-info-icon" />
              <span className="profile-info-label">Password</span>
              <span className="profile-info-value">••••••••</span>
            </div>
          </div>
        ) : (
          <div className="profile-edit-fields">
            <div className="profile-field-group">
              <label className="profile-field-label">Name</label>
              <input
                type="text"
                className="login-input"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="profile-field-group">
              <label className="profile-field-label">Change Password</label>
              <div className="login-input-wrapper" style={{ marginBottom: 0 }}>
                <Lock size={16} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="login-input login-input-with-icon"
                  value={tempPassword}
                  onChange={e => setTempPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  minLength={6}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span className="profile-field-hint">Leave blank to keep current password</span>
            </div>
          </div>
        )}
      </ProfileCard>

      {/* ===== PERSONAL CONTEXT ===== */}
      <ProfileCard
        title="Personal Context"
        icon={Briefcase}
        editing={editingContext}
        onEdit={() => setEditingContext(true)}
        onSave={handleSaveContext}
        onCancel={() => cancelEdit('context')}
      >
        {!editingContext ? (
          <div className="profile-info-list">
            <div className="profile-info-row">
              <Zap size={15} className="profile-info-icon" />
              <span className="profile-info-label">Age Group</span>
              <span className="profile-info-value">{getLabel(AGE_GROUPS, user?.ageGroup)}</span>
            </div>
            <div className="profile-info-row">
              <Briefcase size={15} className="profile-info-icon" />
              <span className="profile-info-label">Occupation</span>
              <span className="profile-info-value">{getLabel(OCCUPATIONS, user?.occupation)}</span>
            </div>
            <div className="profile-info-row">
              <Home size={15} className="profile-info-icon" />
              <span className="profile-info-label">Living Environment</span>
              <span className="profile-info-value">{getLabel(ENVIRONMENTS, user?.environment)}</span>
            </div>
            <div className="profile-info-row">
              <Zap size={15} className="profile-info-icon" />
              <span className="profile-info-label">Main Stress Source</span>
              <span className="profile-info-value">{getLabel(STRESS_SOURCES, user?.stressSource)}</span>
            </div>
          </div>
        ) : (
          <div className="profile-edit-fields">
            <div className="profile-field-group">
              <label className="profile-field-label">Age Group</label>
              <PillSelector options={AGE_GROUPS} value={tempAgeGroup} onChange={setTempAgeGroup} />
            </div>
            <div className="profile-field-group">
              <label className="profile-field-label">Occupation</label>
              <PillSelector options={OCCUPATIONS} value={tempOccupation} onChange={setTempOccupation} />
            </div>
            <div className="profile-field-group">
              <label className="profile-field-label">Living Environment</label>
              <PillSelector options={ENVIRONMENTS} value={tempEnvironment} onChange={setTempEnvironment} />
            </div>
            <div className="profile-field-group">
              <label className="profile-field-label">Main Source of Stress</label>
              <PillSelector options={STRESS_SOURCES} value={tempStressSource} onChange={setTempStressSource} />
            </div>
          </div>
        )}
      </ProfileCard>

      {/* ===== FAMILY & SOCIAL ===== */}
      <ProfileCard
        title="Family & Social Context"
        icon={Users}
        editing={editingFamily}
        onEdit={() => setEditingFamily(true)}
        onSave={handleSaveFamily}
        onCancel={() => cancelEdit('family')}
      >
        {!editingFamily ? (
          <div className="profile-info-list">
            <div className="profile-info-row">
              <Users size={15} className="profile-info-icon" />
              <span className="profile-info-label">People in Household</span>
              <span className="profile-info-value">{user?.household || '—'}</span>
            </div>
            <div className="profile-info-row">
              <Heart size={15} className="profile-info-icon" />
              <span className="profile-info-label">Family Support</span>
              <span className="profile-info-value">{getLabel(FAMILY_SUPPORT, user?.familySupport)}</span>
            </div>
          </div>
        ) : (
          <div className="profile-edit-fields">
            <div className="profile-field-group">
              <label className="profile-field-label">People in Household</label>
              <input
                type="number"
                className="login-input"
                value={tempHousehold}
                onChange={e => setTempHousehold(e.target.value)}
                placeholder="e.g., 4"
                min="1"
                max="20"
              />
            </div>
            <div className="profile-field-group">
              <label className="profile-field-label">Family Support System</label>
              <PillSelector options={FAMILY_SUPPORT} value={tempFamilySupport} onChange={setTempFamilySupport} />
            </div>
          </div>
        )}
      </ProfileCard>

      {/* Privacy + Logout */}
      <div className="profile-footer">
        <div className="profile-privacy">
          <Shield size={14} />
          <span>Your information is securely stored and only used to personalize your mental wellness insights.</span>
        </div>
        <button className="profile-logout-btn" onClick={() => setShowLogoutModal(true)}>
          Log Out
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal fade-in">
            <h3 className="logout-modal-title">Log Out</h3>
            <p className="logout-modal-text">Are you sure you want to log out?</p>
            <div className="logout-modal-actions">
              <button 
                className="logout-btn-cancel" 
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="logout-btn-confirm" 
                onClick={() => {
                  setShowLogoutModal(false);
                  triggerLogoutTransition();
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
