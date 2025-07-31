import type { Route as RouteType } from "./+types/home";
import { useEffect } from "react";
import { init } from "~/api/ApiAuth";
import { Outlet } from "react-router";
import { AuthProvider } from "~/auth/AuthContext";
import { Header } from "~/components/header/Header";


export function meta({ }: RouteType.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  useEffect(() => {
    async function setAttributes() {
      await init().catch(error => console.error("Anonymous session error:", error))
    }
    setAttributes();
  }, []);


  return (
    <>
      <AuthProvider>
        <Header />
        <div className="min-h-screen flex flex-col justify-start gap-y-5">
          <Outlet />
        </div>
      </AuthProvider>
    </>
  );
}
