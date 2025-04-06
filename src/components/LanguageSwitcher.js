import React from 'react';
import { useTranslation } from 'react-i18next';
import UsaFlag from '../assets/usa.svg'; 
import AlbaniaFlag from '../assets/albania.svg';  
import SerbiaFlag from '../assets/srb.svg'; 

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('en')}>
        <img src={UsaFlag} alt="English" width="30" />
      </button>
      <button onClick={() => changeLanguage('sq')}>  
        <img src={AlbaniaFlag} alt="Albanian" width="30" />
      </button>
      <button onClick={() => changeLanguage('sr')}>  
        <img src={SerbiaFlag} alt="Serbia" width="30" />
      </button>
    </div>
  );
};

export default LanguageSwitcher;