import translate from '../assets/translate-icon.png'
import albania from '../assets/albania.svg'
import usa from '../assets/usa.svg'
import srb from '../assets/srb.svg'

// mos harro me shtu qit tag n footer
// <a href="https://www.flaticon.com/free-icons/translate" title="translate icons">Translate icons created by Freepik - Flaticon</a>

import '../css/DropdownMenu.css'
import { isVisible } from '@testing-library/user-event/dist/utils'
import React, {useState} from 'react'

function TranslateMenu(){
  const [isVisible, setIsVisible] = useState(false);

  const HandleTranslateClick = (e) => {
    setIsVisible(!isVisible);
  }

  const handleAlbanianClick = (e) => {
    alert('E preke Shqip!')
  }

  const handleEnglishClick = (e) => {
    alert('E preke Anglisht!')
  }

  const handleSerbianClick = (e) => {
    alert('E preke Serbisht!')
  }

  return (
    <div className='login-nav'>
      <ul className='translate-list'>
        <li>
          <button className='dropdown-menu' onClick={HandleTranslateClick}>
            {/* globi */}
            <img src={translate} className='dropdown-menu' alt='Perkthe'/>
          </button>
        </li>
        <li>
          <button className='dropdown-content' onClick={handleAlbanianClick} id='shqip'
            style={{visibility: isVisible ? 'visible' : 'hidden'}}>
            {/* shqip */}
            <img className='translation-flag' src={albania} alt='Shqip'/>
            {/* <span>Shqip</span> */}
          </button>
        </li>
        <li>
          <button className='dropdown-content' onClick={handleEnglishClick} id='anglisht'
            style={{visibility: isVisible ? 'visible' : 'hidden'}}>
            {/* anglisht */}
            <img className='translation-flag' src={usa} alt='Anglisht'/>
            {/* <span>English</span> */}
          </button>
        </li>
        <li>
          <button className='dropdown-content' onClick={handleSerbianClick} id='serbisht'
            style={{visibility: isVisible ? 'visible' : 'hidden'}}>
            {/* serbisht */}
            <img className='translation-flag' src={srb} alt='Serbisht'/>
            {/* <span>Srpski</span> */}
          </button>
        </li>
      </ul>
    </div>
  )
}

export default TranslateMenu;
