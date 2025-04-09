import { useTranslation } from 'react-i18next';

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
  const {i18n} = useTranslation();
  const [isVisible, setIsVisible] = useState(false)

  const HandleTranslateClick = (e) => {
    setIsVisible(!isVisible);
  }
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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
            {/* tanslate buttoni */}
            <img src={translate} className='dropdown-menu' alt='Perkthe'/>
          </button>
        </li>
        <li>
          <button className='dropdown-content' onClick={() => changeLanguage('sq')} id='shqip'
            style={{visibility: isVisible ? 'visible' : 'hidden'}}>
            {/* shqip */}
            <img src={albania} alt='Shqip'/>
            {/* <span>Shqip</span> */}
          </button>
        </li>
        <li>
          <button className='dropdown-content' onClick={() => changeLanguage('en')} id='anglisht'
            style={{visibility: isVisible ? 'visible' : 'hidden'}}>
            {/* anglisht */}
            <img src={usa} alt='Anglisht'/>
            {/* <span>English</span> */}
          </button>
        </li>
        <li>
          <button className='dropdown-content' onClick={() => changeLanguage('sr')} id='serbisht'
            style={{visibility: isVisible ? 'visible' : 'hidden'}}>
            {/* serbisht */}
            <img src={srb} alt='Serbisht'/>
            {/* <span>Srpski</span> */}
          </button>
        </li>
      </ul>
    </div>
  )
}

export default TranslateMenu;
