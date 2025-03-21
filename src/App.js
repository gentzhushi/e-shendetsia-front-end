import { useState } from 'react';
import './App.css';
import logo from './assets/logo.png'

function App() {
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
    <div className='App'>
      <form onSubmit={handleLogin} id='login-form'>
        <img src={logo}/><br />
        <label>Perdoruesi: <input type='number' value={email} onChange={(e) => {setEmail(e.target.value)}}/></label><br/>
        <label>Fjalekalimi: <input type='password' value={password} onChange={(e) => {setPassword(e.target.value)}}/></label><br/>
        <button type='submit'>Kycu</button><br/>
      </form>
    </div>
  );
}

export default App;
