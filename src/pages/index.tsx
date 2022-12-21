import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import Tools from "../components/Tools";
import HomeSignIn from "../components/HomeSignIn";

const Home: NextPage = () => {
  // If the user's access token has expired, force them to sign in again
  const { data: session, status } = useSession();
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn(); // Force sign in to hopefully resolve error
    }
  }, [session]);

  if (status === "loading") return <div className="bg-black"></div>;
  return (
    <>
      <Head>
        <title>RelionHR</title>
        <meta name="description" content="Simple HR tools" />
        <link rel="icon" href="/logo-only.svg" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        {session ? (
          <Tools />
        ) : (
          <HomeSignIn />
        )}
      </main >
    </>
  );
};

export default Home;

