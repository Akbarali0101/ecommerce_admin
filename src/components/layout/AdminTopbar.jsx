import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

const API_BASE_URL = "http://localhost:5757";

export function AdminTopbar({ title }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    username: 'Bosh Admin',
    email: 'admin@shop.uz',
    avatarUrl: ''
  });

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const getToken = () => localStorage.getItem("admin_token");

  // Backenddan joriy foydalanuvchi ma'lumotini olib, profile state'ga yozamiz
  const fetchMe = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      const user = data.data || data.user || data;

      setProfile({
        username: user.name || 'Admin',
        email: user.email || '',
        avatarUrl: user.profile_image ? `${API_BASE_URL}${user.profile_image}` : ''
      });
    } catch (err) {
      console.error("Profilni olishda xatolik:", err);
    }
  };

  // Sahifa ochilganda / refresh bo'lganda ishga tushadi
  useEffect(() => {
    fetchMe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Backend javobi turli formatda kelishi mumkinligi uchun bir nechta joydan qidiramiz
  const extractFilePath = (uploadData) => {
    return (
      uploadData?.file?.file_path ||
      uploadData?.file_path ||
      uploadData?.data?.file_path ||
      uploadData?.data?.file?.file_path ||
      null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Agar foydalanuvchi faqat bitta parol maydonini to'ldirsa, ogohlantiramiz
    if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
      toast.error("Parolni o'zgartirish uchun ikkala maydonni ham to'ldiring");
      return;
    }

    setLoading(true);
    const token = getToken();

    try {
      // 1) AVATARNI YUKLASH VA SAQLASH
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        const uploadRes = await fetch(`${API_BASE_URL}/upload/file`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}));
          throw new Error(err.msg || err.message || "Rasmni yuklashda xatolik");
        }

        const uploadData = await uploadRes.json();
        const newProfileImg = extractFilePath(uploadData);

        if (!newProfileImg) {
          console.error("Upload javobi kutilmagan formatda:", uploadData);
          throw new Error("Yuklangan rasm manzilini backend javobidan topib bo'lmadi");
        }

        const imgRes = await fetch(`${API_BASE_URL}/auth/update-me-profile-img`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newProfileImg }),
        });

        if (!imgRes.ok) {
          const err = await imgRes.json().catch(() => ({}));
          throw new Error(err.msg || err.message || "Rasmni saqlashda xatolik");
        }
      }

      // 2) USERNAME'NI SAQLASH
      const infoRes = await fetch(`${API_BASE_URL}/auth/update-me-info`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: profile.username }),
      });

      if (!infoRes.ok) {
        const err = await infoRes.json().catch(() => ({}));
        throw new Error(err.msg || err.message || "Ismni saqlashda xatolik");
      }

      // 3) PAROLNI SAQLASH (ikkalasi ham to'ldirilgan bo'lsagina)
      if (oldPassword && newPassword) {
        const passRes = await fetch(`${API_BASE_URL}/auth/update-me-password`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: newPassword,
          }),
        });

        if (!passRes.ok) {
          const err = await passRes.json().catch(() => ({}));
          throw new Error(err.msg || err.message || "Parolni saqlashda xatolik");
        }
      }

      toast.success("Profil muvaffaqiyatli saqlandi!");
      setOldPassword('');
      setNewPassword('');
      setAvatarFile(null);
      setPreviewUrl(null);
      setIsOpen(false);

      // Saqlagandan keyin eng so'nggi ma'lumotni qayta o'qiymiz (avatar, ism yangilanishi uchun)
      await fetchMe();
    } catch (err) {
      console.error("Profilni saqlashda xatolik:", err);
      toast.error("Profilni saqlashda xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.topbar}>
      <h1 style={styles.title}>{title || 'Dashboard'}</h1>

      <div style={styles.rightSection}>
        <div onClick={() => setIsOpen(true)} style={styles.profileWrapper}>
          <div style={styles.avatarCircle}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" style={styles.avatarImg} />
            ) : (
              <span style={styles.avatarLetter}>
                {profile.username ? profile.username.charAt(0).toUpperCase() : 'A'}
              </span>
            )}
          </div>
          <div style={styles.profileText}>
            <span style={styles.usernameText}>{profile.username}</span>
            <span style={styles.emailText}>{profile.email || 'admin@shop.uz'}</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h2 style={modalStyles.heading}>Profil Sozlamalari</h2>

            <form onSubmit={handleSubmit}>
              <div style={modalStyles.avatarWrapper}>
                <div style={modalStyles.avatarCircle}>
                  {previewUrl || profile.avatarUrl ? (
                    <img src={previewUrl || profile.avatarUrl} alt="Avatar" style={modalStyles.avatarImg} />
                  ) : (
                    <span style={modalStyles.avatarPlaceholderLetter}>
                      {profile.username ? profile.username.charAt(0).toUpperCase() : 'A'}
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  style={modalStyles.fileBtn}
                >
                  Rasmni o'zgartirish
                </button>
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Username</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  required
                  style={modalStyles.input}
                />
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Eski Parol</label>
                <div style={modalStyles.passwordWrapper}>
                  <input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Parolni o'zgartirish uchun to'ldiring"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    style={modalStyles.input}
                  />
                  <span
                    style={modalStyles.eyeIcon}
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? '🙈' : '👁️'}
                  </span>
                </div>
              </div>

              <div style={modalStyles.inputGroup}>
                <label style={modalStyles.label}>Yangi Parol</label>
                <div style={modalStyles.passwordWrapper}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={modalStyles.input}
                  />
                  <span
                    style={modalStyles.eyeIcon}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? '🙈' : '👁️'}
                  </span>
                </div>
              </div>

              <div style={modalStyles.actions}>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={modalStyles.cancelBtn}
                  disabled={loading}
                >
                  Bekor qilish
                </button>

                <button
                  type="submit"
                  style={modalStyles.saveBtn}
                  disabled={loading}
                >
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e5e7eb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    width: '100%',
    boxSizing: 'border-box'
  },
  title: { fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 },
  rightSection: { display: 'flex', alignItems: 'center', gap: '20px' },
  profileWrapper: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' },
  avatarCircle: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarLetter: { fontSize: '14px', fontWeight: '500', color: '#6b7280' },
  profileText: { display: 'flex', flexDirection: 'column', lineHeight: '1.2' },
  usernameText: { fontSize: '14px', fontWeight: '600', color: '#111827' },
  emailText: { fontSize: '11px', color: '#9ca3af' }
};

const modalStyles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  modal: { backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px 32px', width: '420px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', boxSizing: 'border-box' },
  heading: { fontSize: '18px', fontWeight: '500', color: '#111827', margin: '0 0 20px 0' },
  avatarWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' },
  avatarCircle: { width: '84px', height: '84px', borderRadius: '50%', backgroundColor: '#e5e7eb', overflow: 'hidden', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholderLetter: { fontSize: '28px', fontWeight: '600', color: '#6b7280' },
  fileBtn: { background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', fontSize: '15px', fontWeight: '400', padding: 0 },
  inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '18px' },
  label: { fontSize: '15px', fontWeight: '400', color: '#111827', marginBottom: '8px' },
  input: { padding: '12px 14px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '15px', color: '#111827', outline: 'none', boxSizing: 'border-box', width: '100%' },
  passwordWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  eyeIcon: { position: 'absolute', right: '14px', cursor: 'pointer', fontSize: '16px', userSelect: 'none' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' },
  cancelBtn: { padding: '10px 18px', border: '1px solid #e5e7eb', borderRadius: '10px', backgroundColor: '#ffffff', color: '#111827', fontSize: '15px', cursor: 'pointer', fontWeight: '400' },
  saveBtn: { padding: '10px 22px', border: 'none', borderRadius: '10px', backgroundColor: '#24537b', color: '#ffffff', fontSize: '15px', cursor: 'pointer', fontWeight: '400' }
};