import { Fragment, useEffect, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import LockUser from './LockUser'
import UnlockUser from './UnlockUser'
import { FaceFrownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { signOut } from 'next-auth/react'

export interface Command {
  id: number,
  name: string,
}
const cmdList = [
  { id: 1, name: 'lock-user' },
  { id: 2, name: 'unlock-user' },
]
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
export default function CommandPalette() {
  const [cmd, setCmd] = useState('')
  const [query, setQuery] = useState('')

  const filteredCmd =
    query === ''
      ? []
      : cmdList.filter((cmd) => {
        return cmd.name.toLowerCase().includes(query.toLowerCase())
      })
  const cmdJSX = () => {
    switch (cmd) {
      case 'unlock-user':
        return (
          <LockUser />
        )
      case 'lock-user':
        return (
          <UnlockUser />
        )
      default:
        return <></>
    }
  }

  return (
    <Transition.Root
      show={true}
      as={Fragment}
      afterLeave={() => setQuery('')}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={() => console.log('nope')}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-95"
            enterFrom="opacity-0 scale-0"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform rounded-xl bg-gray-900 shadow-2xl transition-all">
              <Combobox onChange={(cmd: Command) => setCmd(cmd.name)}>
                <div className="relative ">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                    aria-hidden="true" />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                    placeholder="Search command"
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                {filteredCmd.length > 0 && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto">
                    <li className="p-2">
                      <ul className="text-sm text-gray-400">
                        {filteredCmd?.map((cmd) => (
                          <Combobox.Option
                            key={cmd.id}
                            value={cmd}
                            className={({ active }) =>
                              classNames(
                                'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                active && 'bg-gray-800 text-white',
                              )
                            }
                          >
                            {({ active }) => (
                              <>
                                <span className="ml-3 flex-auto truncate">{cmd.name}</span>
                                {active && (
                                  <span className="ml-3 flex-none text-gray-400">Jump to...</span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </ul>
                    </li>
                  </Combobox.Options>
                )}
                {query === '' && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto">
                    <li className="p-2">
                      <ul className="text-sm text-gray-400">
                        {cmdList?.map((cmd) => (
                          <Combobox.Option
                            key={cmd.id}
                            value={cmd}
                            className={({ active }) =>
                              classNames(
                                'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                active && 'bg-gray-800 text-white',
                              )
                            }
                          >
                            {({ active }) => (
                              <>
                                <span className="ml-3 flex-auto truncate">{cmd.name}</span>
                                {active && (
                                  <span className="ml-3 flex-none text-gray-400">Jump to...</span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </ul>
                    </li>
                  </Combobox.Options>
                )}
                {query !== '' && filteredCmd.length === 0 && (
                  <div className="py-14 px-6 text-center sm:px-14">
                    <FaceFrownIcon className="mx-auto h-6 w-6 text-gray-500" aria-hidden="true" />
                    <p className="mt-4 text-sm text-gray-200">No matching commands.</p>
                  </div>
                )}
              </Combobox>
              {cmdJSX()}
              {/* create a styled button */}
              <div className="flex justify-end p-4 border-t border-gray-500">
                <button

                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-transparent rounded-md hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                  onClick={() => signOut()}
                >
                  Sign Out
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
