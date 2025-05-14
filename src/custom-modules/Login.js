/**
 * Log In page
 *
 * Ky file shfaq formen e login qe perfshin:
 * - Fushen e identifikimit te perdoruesit
 * - Fushen e fjalekalimit
 * - Linkun per fjalekalimin e harruar
 * - Butonin e hyrjes
 * - Menune e perkthimit
 * - Emblemen
 * - Footer-in
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Emblem from './Emblem'
import TranslateMenu from './TranslateMenu'
import Footer from './Footer'
import '../css/login.css'
import '../css/index.css'

/**
 * Komponenti Login
 * @returns {JSX.Element} Forma e hyrjes
 */
function Login() {
  /** Gjendja per ruajtjen e identifikuesit te perdoruesit */
  const [email, setEmail] = useState('')
  /** Gjendja per ruajtjen e fjalekalimit */
  const [password, setPassword] = useState('')
  /** Hook per perkthimin */
  const { t } = useTranslation()

  /**
   * Menaxhon tentimin per hyrje
   * @param {Event} e - Eventi i formes
   */
  const handleLogin = (e) => {
    e.preventDefault()

    // if (email === '' || password === '') {
    //   alert(t('fill_all_fields'))
    //   return
    // }
    // alert(t('login_attempt', { email, password }))
  }

  return (
      <div className='login-page'>
        <TranslateMenu />
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
        <Footer />
      </div>
  )
}

export default Login;