import { useState } from 'react'

import Emblem from './Emblem'
import TranslateMenu from './TranslateMenu.js'

import '../css/login.css'
import '../css/index.css'

function Login() {
  const [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  
  const handleLogin = (e) =>{
    e.preventDefault()
    if (email == '' || password == ''){
      alert("Plotsoj krejt fushat.")
      return
    }
      alert("E bone login me te dhenat:" + email + " dhe " + password)
  }
  
  return (
    <div className='login-page'>
      <TranslateMenu />
      <form onSubmit={handleLogin} id='login-form'>
        <Emblem />
        <label>Perdoruesi: <input type='number' pattern='[0-9]*' value={email} onChange={(e) => {setEmail(e.target.value)}}/></label><br/>
        <label>Fjalekalimi: <input type='password' value={password} onChange={(e) => {setPassword(e.target.value)}}/></label><br/>
        
        <a href='/'>Keni harruar fjalekalimin?</a>
        <button className='accent-button' type='submit'>Kycu</button><br/>
      </form>
    </div>
  );
}

export default Login;
