import { useI18n } from '../i18n/locale'
import { sfx } from '../game/audio'

export function LanguageToggle({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const { locale, setLocale } = useI18n()
  const pad = size === 'md' ? 'px-4 py-2.5 text-[10px]' : 'px-2.5 py-2 text-[9px]'

  return (
    <div className="flex overflow-hidden rounded-lg border border-grape/35 bg-deep/70 backdrop-blur">
      {(['pt', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => {
            sfx.ui()
            setLocale(code)
          }}
          className={`font-pixel uppercase transition-colors ${pad} ${
            locale === code ? 'bg-neon text-void' : 'text-grape hover:text-neon'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
