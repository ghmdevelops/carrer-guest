import { LocaleProvider } from './i18n/locale'
import { GameStage } from './components/GameStage'

export function App() {
  return (
    <LocaleProvider>
      <GameStage />
    </LocaleProvider>
  )
}
