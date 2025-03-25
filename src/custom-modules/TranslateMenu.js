import translate from '../assets/translate-icon.png'
import albania from '../assets/albania.svg'
import usa from '../assets/usa.svg'
import srb from '../assets/srb.svg'

// mos harro me shtu qit tag n footer
// <a href="https://www.flaticon.com/free-icons/translate" title="translate icons">Translate icons created by Freepik - Flaticon</a>

import '../css/TranslateMenu.css'

function TranslateMenu(){
    return (
        <div className='login-nav'>
            <button className='dropdown-menu'>
                {/* globi */}
                <img src={translate} className='dropdown-menu' style={{height:'100%'}}/>
            </button>
            <ul>
                <li>
                    <button className='dropdown-content'>
                        {/* shqip */}
                        <img src={albania} />
                        <span>Shqip</span>
                    </button>
                </li>
                <li>
                    <button className='dropdown-content'>
                        {/* anglisht */}
                        <img src={usa} />
                        <span>English</span>
                    </button>
                </li>
                <li>
                    <button className='dropdown-content'>
                        {/* serbisht */}
                        <img src={srb} />
                        <span>Srpski</span>
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default TranslateMenu;