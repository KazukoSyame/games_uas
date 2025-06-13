import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { defaultProgress } from '../data/defaultProgress'; // Import defaultProgress
import '../styles/LoginPages.css'; // pastikan ini ada


// Fungsi login terpisah
export const handleLogin = async (email, password, navigate) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCred.user.uid;

    // Ambil data user dari Firestore
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    const data = snap.exists() ? snap.data() : defaultProgress;

    // Simpan progress ke localStorage
    localStorage.setItem("playerProgress", JSON.stringify(data));
    localStorage.setItem('userId', userId);

    // Cek apakah sudah ada nama dan karakter
    if (!data.playerName || !data.selectedCharacter) {
      // Hapus localStorage terkait karakter/nama agar tidak bentrok
      localStorage.removeItem('playerName');
      localStorage.removeItem('selectedCharacter');
      localStorage.removeItem('selectedCharacterImg');
      // Redirect ke halaman pemilihan karakter & nama
      navigate('/character-select');
    } else {
      // Simpan ke localStorage
      localStorage.setItem('playerName', data.playerName);
      localStorage.setItem('selectedCharacter', JSON.stringify(data.selectedCharacter));
      localStorage.setItem('selectedCharacterImg', data.selectedCharacter.img || "/assets/charmale.png");
      // Redirect ke home
      navigate('/home');
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed! Please try again later.");
  }
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCred.user.uid;
      await setDoc(doc(db, 'users', userId), defaultProgress);
      alert('Account created! You can now log in.');
      setIsSignup(false); // Switch back to login view
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed! Please try again later.");
    }
  };

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => document.body.classList.remove('login-page');
  }, []);

  return (
    <div className="page-login-wrapper">
      <div className="wrapper">
        <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>
        <form onSubmit={(e) => { 
          e.preventDefault(); 
          if (isSignup) {
            handleSignUp(e);
          } else {
            handleLogin(email, password, navigate);
          }
        }}>
          <div className="input-box">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <i className="fa fa-envelope"></i>
          </div>
          <div className="input-box">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <i className="fa fa-lock"></i>
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="btn">{isSignup ? 'Sign Up' : 'Login'}</button>
          <button type="button" className="btn" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
          </button>
          <div className="register-link">
            <p>Don't have an account? <a href="#">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
