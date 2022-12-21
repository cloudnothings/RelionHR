import type { User } from '@microsoft/microsoft-graph-types'
import { useEffect, useState } from 'react'
import { trpc } from '../utils/trpc'
import LockAccountButton from './LockAccountButton'
import { StyledButton } from './StyledButton'
import UnlockAccountButton from './UnlockAccountButton'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const UserTools = () => {
  const [animationParent] = useAutoAnimate()
  const [selectedItem, setSelectedItem] = useState('')
  const [items, setItems] = useState<User[]>([])
  trpc.graph.getUsers.useQuery(undefined, {
    onSuccess: (results) => {
      if (results.length > 0) {
        setItems(results)
      }
    },
  })
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    if (selectedItem) {
      const selectedUser = items.find(item => item.id === selectedItem)
      if (selectedUser) {
        setUser(selectedUser)
      }
    }
  }, [items, selectedItem])
  return (
    // @ts-expect-error - This is a bug in the auto-animate library
    <div className='flex flex-row bg-[#222] items-center justify-center rounded-lg p-4 gap-4' ref={animationParent}>
      <div className='text-white text-2xl self-start'>
        User
      </div>
      <div className='flex flex-col gap-y-4'>
        <select className='w-full text-white rounded-md border border-white bg-transparent py-2 pl-3 pr-72 focus:border-white focus:outline-none focus:ring-0 sm:text-sm'
          value={selectedItem} onChange={event => setSelectedItem(event.target.value)}>
          {items.map(item => (
            <option className='absolute border-2 text-white z-10 mt-1 max h-80 w-full rounded-md bg-[#111] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-md'
              key={item.id} value={item.id}>
              {item.displayName}
            </option>
          ))}
        </select>
        <div className='grid grid-cols-2 gap-4 '>
          <LockAccountButton user={user} />
          <UnlockAccountButton user={user} />
        </div>
        {user ? (
          <div className=''>
            <div className='text-white text-2xl self-start'>
              User Details
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='text-white text-lg self-start'>
                Display Name
              </div>
              <div className='text-white text-lg self-start'>
                {user.displayName}
              </div>
              <div className='text-white text-lg self-start'>
                Email Address
              </div>
              <div className='text-white text-lg self-start'>
                {user.mail}
              </div>
              <div className='text-white text-lg self-start'>
                Account Enabled
              </div>
              <div className='text-white text-lg self-start'>
                {user.accountEnabled ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        )
          : <></>}
      </div>
    </div >
  )
}

export default UserTools