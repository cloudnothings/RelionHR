import { useState } from 'react'
import { trpc } from '../utils/trpc'
import AutoCompleteM365Users from './AutocompleteM365Users'
import ConfirmationModal from './ConfirmationModal'

export interface User {
  id: string
  displayName: string
  accountEnabled: boolean
  userPrincipalName: string
}

export const UnlockUser = () => {
  const unlockUserMutator = trpc.graph.lockUser.useMutation()
  const [selectedUser, setSelectedUser] = useState<User>()
  const changeUser = (user: User) => {
    setSelectedUser(user)
  }

  const unlockUserHandler = () => {
    if (selectedUser) {
      unlockUserMutator.mutateAsync({
        userId: selectedUser.id,
      })
      setShowConfirmationModal(false)
    }
  }

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  return (
    <div className="flex items-center h-auto">
      <div className="border-0 border-t pt-2 border-opacity-20 border-t-gray-500 ml-4">
        <span>User Reset Password</span>
        <div className="mt-4 grid grid-cols-12 gap-6 pb-10">
          <div className="col-span-12 sm:col-span-6">
            <AutoCompleteM365Users onChange={changeUser} />
          </div>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmationModal
          title="Unlock User"
          message={`Are you sure you want to unlock ${selectedUser?.displayName}'s account?`}
          confirmMessage="Unlock User"
          onConfirm={unlockUserHandler}
          onCancel={() => setShowConfirmationModal(false)}
          open={showConfirmationModal}
          setOpen={setShowConfirmationModal}
          onClose={setShowConfirmationModal}
        />
      )}
    </div>
  )
}

export default UnlockUser
