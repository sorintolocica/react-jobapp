import React from 'react'
import { useAtom } from 'jotai'
import Main from './navigation'
import Initial from '../scenes/initial/Initial'
import { checkedAtom, loggedInAtom } from '../utils/atom'

const Routes = () => {
  const [checked] = useAtom(checkedAtom)
  const [loggedIn] = useAtom(loggedInAtom)

  // TODO: switch router by loggedIn state
  console.log('[##] loggedIn', loggedIn)

  // rendering
  if (!checked) {
    return <Initial />
  }

  return <Main />
}

export default Routes
