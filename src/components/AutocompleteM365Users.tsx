import type { User } from "@microsoft/microsoft-graph-types";
import { useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import { trpc } from '../utils/trpc'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
export default function AutoCompleteM365Users({
  onChange,
}: {
  onChange: (user: User) => void
}) {
  const [query, setQuery] = useState('')
  const [user, setSelectedUser] = useState<User>()
  const [users, setUsers] = useState<User[]>([])
  trpc.graph.getUsers.useQuery(undefined, {
    onSuccess: (users) => {
      if (users.length > 0) {
        setUsers(users)
      }
    },
    refetchOnWindowFocus: false,
  })
  const changeUserHandler = (user: User) => {
    setSelectedUser(user)
    onChange(user)
  }
  const filteredUsers =
    query === ''
      ? users
      : users.filter((user) => {
        return user.displayName?.toLowerCase().includes(query.toLowerCase())
      })
  return (
    <Combobox as="div" value={user} onChange={changeUserHandler} >
      <Combobox.Label className="block text-sm font-medium text-white">User</Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full text-white rounded-md border border-white bg-transparent py-2 pl-3 pr-14 focus:border-white focus:outline-none focus:ring-0 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(user: User) => (user?.displayName ? user.displayName : '')}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-[#888]" aria-hidden="true" />
        </Combobox.Button>

        {filteredUsers.length > 0 && (
          <Combobox.Options className="absolute text-white z-10 mt-1 max h-80 w-full overflow-auto rounded-md bg-[#111] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredUsers.map((u) => (
              <Combobox.Option
                key={u.id}
                value={u}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-[#333] text-white' : 'text-white',
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={classNames('block truncate', selected ? 'font-semibold' : '')}>
                      {u.displayName}
                    </span>
                    <span
                      className={classNames(
                        'truncate text-[#888]',
                        active ? 'text-white' : 'text-[#888]',
                      )}
                    >
                      {u.mail}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-white',
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}
