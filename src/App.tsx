import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import { Layout } from "antd";
import { Header } from "antd/es/layout/layout";
import supabase from "./utils/supabase";
import MainLayout from "./components/MainLayout";
import { Session } from "@supabase/supabase-js";
import LoginForm from "./components/LoginForm";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <Layout className="layout">
        <Header className="header">
          <img src={viteLogo} className="logo" alt="Vite Logo" />
          <h1 className="title">Car Market Dashboard</h1>
        </Header>
        {!session ? <LoginForm /> : <MainLayout />}
      </Layout>
    </>
  );
}

export default App;
