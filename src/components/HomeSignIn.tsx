import { signIn } from "next-auth/react"

export const HomeSignIn = () => {
  return (<div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 ">
    <h1 className="text-5xl font-extrabold tracking-tight text-[#13b6f6] sm:text-[5rem]">
      Relion <span className="text-[hsl(0,0%,100%)]">HR</span>
    </h1>
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">

        </p>
        <button type="button"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => signIn('azure-ad')}
        >
          {"Sign in with your Microsoft Account"}
        </button>
      </div>
    </div>
  </div >)
}

export default HomeSignIn