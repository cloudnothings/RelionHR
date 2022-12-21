export const StyledButton = ({ message, onClick }: { message: string, onClick: () => void }) => {
  return (
    <button className="bg-[#999] min-h-10 rounded-md hover:bg-white hover:scale-105 duration-100 active:scale-95"
      onClick={onClick}>
      <div className="p-2">
        {message}
      </div>
    </button>
  )
}