import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import CommandPalette from "../components/CommandPalette";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (status === "loading") return <div className="bg-black"></div>;
  return (
    <>
      <Head>
        <title>RelionHR</title>
        <meta name="description" content="Simple HR tools" />
        <link rel="icon" href="/logo-only.svg" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        {session ? (<CommandPalette />
        ) : (<><div className="container flex flex-col items-center justify-center gap-8 px-4 py-16 ">
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
        </div ></>)}
      </main >
    </>
  );
};

export default Home;

