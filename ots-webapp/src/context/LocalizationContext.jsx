import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import localizationService from '../services/localizationService'


const LocalizationContext = createContext()

export const LocalizationProvider = ({ children }) => {
    const [locale, setLocaleState] = useState(localizationService.getLocale())
    const [availableLocales] = useState(localizationService.getAvailableLocales())

    // Force update when locale changes to re-trigger translations
    const [version, setVersion] = useState(0)

    const changeLocale = useCallback((newLocale) => {
        localizationService.setLocale(newLocale)
        setLocaleState(newLocale)
        setVersion(v => v + 1)
    }, [])

    const t = useCallback((key) => localizationService.t(key), [version])

    // Sync initial state with localStorage/Service defaults
    useEffect(() => {
        const saved = localizationService.getLocale()
        if (saved !== locale) {
            changeLocale(saved)
        }
    }, [changeLocale, locale])

    const value = {
        locale,
        t,
        availableLocales,
        changeLocale,
        formatCurrency: localizationService.formatCurrency,
        formatDate: localizationService.formatDate,
        dir: localizationService.LOCALES[locale]?.dir || 'ltr'
    }

    return (
        <LocalizationContext.Provider value={value}>
            <div key={version} dir={value.dir} className="localization-wrapper h-full w-full">
                {children}
            </div>
        </LocalizationContext.Provider>
    )
}

export const useLocalization = () => {
    const context = useContext(LocalizationContext)
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider')
    }
    return context
}

export const useTranslation = useLocalization
export default LocalizationContext
