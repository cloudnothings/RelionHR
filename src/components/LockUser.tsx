import { useState } from 'react'
import { trpc } from '../utils/trpc'
import AutoCompleteM365Users from './AutocompleteM365Users'
import ConfirmationModal from './ConfirmationModal'

export const LockUser = () => {
  const LockUserMutator = trpc.graph.lockUser.useMutation()
  const [selectedUser, setSelectedUser] = useState<any>()
  const changeUser = (user: any) => {
    setSelectedUser(user)
  }

  const lockUserHandler = () => {
    if (selectedUser) {
      LockUserMutator.mutateAsync({
        userId: selectedUser.id,
      })
      setShowConfirmationModal(false)
    }
  }

  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  return (
    <div className="flex items-center h-auto">
      <div className="border-0 border-t pt-2 border-opacity-20 border-t-gray-500 ml-4">
        <span>Lock User</span>
        <div className="mt-4 grid grid-cols-12 gap-6 pb-10">
          <div className="col-span-12 sm:col-span-6">
            <AutoCompleteM365Users onChange={changeUser} />
          </div>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmationModal
          title="Lock User"
          message={`Are you sure you want to lock ${selectedUser?.displayName}'s account?`}
          confirmMessage="Lock User"
          onConfirm={lockUserHandler}
          onCancel={() => setShowConfirmationModal(false)}
          open={showConfirmationModal}
          setOpen={setShowConfirmationModal}
          onClose={setShowConfirmationModal}
        />
      )}
    </div>
  )
}

export default LockUser
