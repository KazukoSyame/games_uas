// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import defaultProgress from '../data/defaultProgress';
import '../styles/LoginPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCred.user.uid;
      const docRef = doc(db, 'users', userId);
      const snap = await getDoc(docRef);
      const data = snap.exists() ? snap.data() : defaultProgress;

      localStorage.setItem('userId', userId);
      localStorage.setItem('playerName', email);
      localStorage.setItem('progress', JSON.stringify(data.progress));
      localStorage.setItem('inventory', JSON.stringify(data.inventory));
      localStorage.setItem('time', JSON.stringify(data.time));
      localStorage.setItem('messages', JSON.stringify(data.messages));

      navigate('/character-select');
    } catch (err) {
      alert('Login failed!');
      console.error(err);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCred.user.uid;
      await setDoc(doc(db, 'users', userId), defaultProgress);
      alert('Account created! You can now log in.');
    } catch (err) {
      alert('Sign up failed!');
      console.error(err);
    }
  };

  useEffect(() => {
    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      document.body.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => document.body.classList.remove('login-page');
  }, []);

  return (
    <div className="page-login-wrapper">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="remember-forgot">
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="btn">Login</button>
          <button type="button" className="btn" onClick={handleSignUp}>Sign Up</button>
          <div className="register-link">
            <p>Don't have an account? <a href="#">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
