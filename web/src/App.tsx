import { useEffect, useRef, useState } from "react";
import { Header } from "./components/header/Header";
import { Home } from "./pages/home/Home";
import { verifyUser } from "./api/auth";
import { AuthForm } from "./components/authForm/AuthForm";

interface AuthState {
  email: string;
  loggedIn: boolean;
}

function App() {
  const authRef = useRef<HTMLDialogElement>(null);
  const [session, setSession] = useState<AuthState>({
    email: "",
    loggedIn: false,
  });

  useEffect(() => {
    verifyUser()
      .then((resp) => {
        startSession(resp.email);
      })
      .catch(() => {
        authRef.current?.showModal();
      });
  }, []);

  function startSession(email: string) {
    setSession(() => {
      return {
        email: email,
        loggedIn: true,
      };
    });
  }

  function endSession() {
    // todo: logout user
    setSession(() => {
      return {
        email: "",
        loggedIn: false,
      };
    });
  }

  return (
    <>
      <Header
        text="Media Storage"
        email={session.email}
        loggedIn={session.loggedIn}
        endSession={endSession}
      />
      <Home />
      <dialog ref={authRef} className="p-4">
        <AuthForm dialogRef={authRef} startSession={startSession} />
      </dialog>
    </>
  );
}

export default App;
