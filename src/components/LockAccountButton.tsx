import type { User } from '@microsoft/microsoft-graph-types'
import { useState } from 'react'
import { trpc } from '../utils/trpc'
import ConfirmationModal from './ConfirmationModal'
import { StyledButton } from './StyledButton'

const LockAccountButton = ({ user }: { user: User | null }) => {
  const [showModal, setShowModal] = useState(false)
  const mutator = trpc.graph.lockUser.useMutation()
  const handler = () => {
    if (user?.id) {
      mutator.mutateAsync({
        userId: user.id,
      })
      setShowModal(false)
    }
  }
  const Modal = () => {
    return (
      <ConfirmationModal
        title="Lock User"
        message={`Are you sure you want to lock ${user?.displayName}'s account?`}
        confirmMessage="Lock User"
        onConfirm={handler}
        open={showModal}
        setOpen={setShowModal}
      />
    )
  }
  return (
    <>
      {showModal && (<Modal />)}
      <StyledButton message={'Lock Account'} onClick={() => setShowModal(true)} />
    </>
  )
}

export default LockAccountButton