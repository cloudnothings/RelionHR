import type { User } from '@microsoft/microsoft-graph-types'
import { useState } from 'react'
import { trpc } from '../utils/trpc'
import ConfirmationModal from './ConfirmationModal'
import { StyledButton } from './StyledButton'

const UnlockAccountButton = ({ user }: { user: User | null }) => {
  const [showModal, setShowModal] = useState(false)
  const mutator = trpc.graph.unlockUser.useMutation()
  const handler = () => {
    if (user?.id) {
      mutator.mutateAsync({
        userId: user.id,
      })
      setShowModal(false)
    }
  }
  const Modal = () => {
    return (<ConfirmationModal
      title="Unlock User"
      message={`Are you sure you want to unlock ${user?.displayName}'s account?`}
      confirmMessage="Unlock User"
      onConfirm={handler}
      open={showModal}
      setOpen={setShowModal}
    />)
  }
  return (
    <>
      {showModal && (<Modal />)}
      <StyledButton message={'Unlock Account'} onClick={() => setShowModal(true)} />
    </>
  )
}

export default UnlockAccountButton