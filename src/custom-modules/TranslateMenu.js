import translate from '../assets/translate-icon.png'
import albania from '../assets/albania.svg'
import usa from '../assets/usa.svg'
import srb from '../assets/srb.svg'

// mos harro me shtu qit tag n footer
// <a href="https://www.flaticon.com/free-icons/translate" title="translate icons">Translate icons created by Freepik - Flaticon</a>

import '../css/DropdownMenu.css'

function TranslateMenu(){
    return (
        <div style={{height: '100%'}}>
            <div className='dropdown-menu'>
                {/* globi */}
                <img src={translate} className='dropdown-menu' style={{height:'100%'}}/>
            </div>
            <div className='dropdown-content'>
                {/* shqip */}
                <img src={albania} />
                <span>Shqip</span>
            </div>
            <div className='dropdown-content'>
                {/* anglisht */}
                <img src={usa} />
                <span>English</span>
            </div>
            <div className='dropdown-content'>
                {/* serbisht */}
                <img src={srb} />
                <span>Srpski</span>
            </div>
        </div>
    )
}

export default TranslateMenu;