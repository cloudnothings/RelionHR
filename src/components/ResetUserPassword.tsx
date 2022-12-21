import type { User } from "@microsoft/microsoft-graph-types";
import { useState } from 'react'
import { trpc } from '../utils/trpc'
import AutoCompleteM365Users from './AutocompleteM365Users'
import ConfirmationModal from './ConfirmationModal'

export const ResetUserPassword = () => {
  const ResetPasswordMutator = trpc.graph.resetUserPassword.useMutation()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const changeUser = (user: User | null) => {
    setSelectedUser(user)
  }
  const [password, setPassword] = useState<string>('')

  const resetPasswordHandler = () => {
    if (selectedUser?.id) {
      ResetPasswordMutator.mutateAsync({
        userId: selectedUser.id,
        password,
      })
      setShowConfirmationModal(false)
    }
  }
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  return (
    <div>
      <div className="flex items-center h-auto">
        <div className="pt-2 text-white border-opacity-20 ml-4">
          <span>Reset User Password</span>
          <div className="mt-4 grid grid-cols-12 gap-6 pb-10">
            <div className="col-span-12 sm:col-span-6">
              <AutoCompleteM365Users onChange={changeUser} />
            </div>
            <div className="col-span-12 sm:col-span-6">

              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-white rounded-md border border-white bg-transparent py-2 pl-3 pr-14 focus:border-white focus:outline-none focus:ring-0 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        {showConfirmationModal && (
          <ConfirmationModal
            title="Reset Password"
            message={`Are you sure you want to reset ${selectedUser?.displayName}'s password to ${password}?`}
            confirmMessage="Reset Password"
            onConfirm={resetPasswordHandler}
            open={showConfirmationModal}
            setOpen={setShowConfirmationModal}
          />
        )}
      </div>
      <div className="flex justify-end p-4">
        <button type="button"
          className="transition text-black border font-bold py-2 px-4 rounded bg-white
              hover:bg-black hover:text-white duration-300"
          onClick={() => setShowConfirmationModal(true)}
        >
          Reset Password
        </button>
      </div>
    </div>
  )
}

export default ResetUserPassword
