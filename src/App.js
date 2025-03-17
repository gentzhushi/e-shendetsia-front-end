import { useState } from 'react';
import './App.css';

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
    <div className="App">
      <div className='Modal'>
        <form onSubmit={handleLogin}>
          <label>Perdoruesi: <input type='number' value={email} onChange={(e) => {setEmail(e.target.value)}}/></label><br/>
          <label>Fjalekalimi: <input type='password' value={password} onChange={(e) => {setPassword(e.target.value)}}/></label><br/>
          <input type="submit" /><br/>
        </form>
      </div>
    </div>
  );
}

export default App;
