import { memo } from 'react'
import { COIN_SIZE, GROUND_H } from '../game/constants'
import type { LevelCoin } from '../game/level'

export const Coin = memo(function Coin({ coin, taken }: { coin: LevelCoin; taken: boolean }) {
  if (taken) return null
  return (
    <div
      className="coin-bob absolute"
      style={{
        left: coin.x,
        bottom: GROUND_H + coin.y,
        width: COIN_SIZE,
        height: COIN_SIZE,
        animationDelay: `${(coin.index % 5) * 0.18}s`,
      }}
    >
      <div className="coin-face h-full w-full rounded-full" />
    </div>
  )
})
