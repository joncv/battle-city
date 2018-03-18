import { Map } from 'immutable'
import { replace } from 'react-router-redux'
import { put, select } from 'redux-saga/effects'
import { State } from 'types'
import { TANK_LEVELS } from 'utils/constants'
import { nonPauseDelay } from 'sagas/common'

export default function* statistics() {
  yield put(replace('/statistics'))

  const { game: { killInfo } }: State = yield select()

  const player1KillInfo = killInfo.get('player-1', Map<TankLevel, KillCount>())

  // todo 目前只考虑player-1的信息

  yield nonPauseDelay(DEV.FAST ? 200 : 500)

  for (const tankLevel of TANK_LEVELS) {
    const { game: { transientKillInfo } }: State = yield select()

    yield nonPauseDelay(DEV.FAST ? 100 : 250)
    const levelKillCount = player1KillInfo.get(tankLevel, 0)
    if (levelKillCount === 0) {
      yield put<Action>({
        type: 'UPDATE_TRANSIENT_KILL_INFO',
        info: transientKillInfo.setIn(['player-1', tankLevel], 0),
      })
    } else {
      for (let count = 1; count <= levelKillCount; count += 1) {
        yield put<Action>({
          type: 'UPDATE_TRANSIENT_KILL_INFO',
          info: transientKillInfo.setIn(['player-1', tankLevel], count),
        })
        yield nonPauseDelay(DEV.FAST ? 64 : 160)
      }
    }
    yield nonPauseDelay(DEV.FAST ? 80 : 200)
  }
  yield nonPauseDelay(DEV.FAST ? 80 : 200)
  yield put<Action>({ type: 'SHOW_TOTAL_KILL_COUNT' })
  yield nonPauseDelay(DEV.FAST ? 400 : 1000)
}
