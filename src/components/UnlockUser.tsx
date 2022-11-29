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
  const unlockUserMutator = trpc.graph.unlockUser.useMutation()
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
    <>
      <div className="flex items-center h-auto">
        <div className="pt-2 text-white border-opacity-20 ml-4">
          <span>Unlock User</span>
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
      <div className="flex justify-end p-4">
        <button type="button"
          className="btn transition text-black border font-bold py-2 px-4 rounded bg-white
                hover:bg-black hover:text-white duration-300"
          onClick={() => setShowConfirmationModal(true)}
        >
          Unlock User
        </button>
      </div>
    </>
  )
}

export default UnlockUser
