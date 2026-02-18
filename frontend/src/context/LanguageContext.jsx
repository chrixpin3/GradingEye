import React, { createContext, useContext, useEffect, useState } from "react";
import { LANGUAGES } from "../constants/languages";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("language") || "en";
    });

    useEffect(() => {
        localStorage.setItem("language", language);
    }, [language]);

    // Translation function
    const t = (key) => {
        return translations[language]?.[key] || translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, allLanguages: LANGUAGES, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
