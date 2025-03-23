import logo from '../assets/logo.png'

import '../css/emblem.css'

function Emblem() {
    
    return (
        <div className='emblem-header'>
            <img src={logo}/>
            <div>
                <span>Ministria e Shendetsise</span>
                <span>Ministry of Health</span>
                <span>Ministarstvo Zdravstva</span>
            </div>
        </div>
    )
}

export default Emblem;