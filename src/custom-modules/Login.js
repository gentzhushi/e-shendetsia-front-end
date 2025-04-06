import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Emblem from './Emblem';
import LanguageSwitcher from '../components/LanguageSwitcher';

import '../css/login.css';
import '../css/index.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      alert(t('fill_all_fields'));
      return;
    }
    alert(t('login_attempt', { email, password }));
  }
  
  return (
    <div className='login-page'>
      <LanguageSwitcher />
      <form onSubmit={handleLogin} id='login-form'>
        <Emblem />
        <label>
          {t('username')}: 
          <input 
            type='number' 
            pattern='[0-9]*' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br/>
        <label>
          {t('password')}: 
          <input 
            type='password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br/>
        
        <a href='/'>{t('forgot_password')}</a>
        <button className='accent-button' type='submit'>
          {t('login_button')}
        </button>
        <br/>
      </form>
    </div>
  );
}

export default Login;