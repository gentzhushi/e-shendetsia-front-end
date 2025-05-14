import logo from '../assets/logo.png'

import '../css/emblem.css'

//Krijimi i emblemes per login page
function Emblem() {
    
    return (
        <div className='emblem-header'>
            <img src={logo}/>
            <div>
                <span>Ministria e Shëndetësisë</span>
                <span>Ministry of Health</span>
                <span>Ministarstvo Zdravstva</span>
            </div>
        </div>
    )
}

// Eksportimi nfaqe tjera
export default Emblem;