import { FormEvent, useState } from "react";
import { login } from "../../api/auth";

interface Props {
  dialogRef: any;
  startSession: (email: string) => void;
}

interface LoginInfo {
  email: string;
  password: string;
}

interface ErrorState {
  emailWarning: string;
  passwordWarning: string;
}

export function AuthForm(props: Props) {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({
    email: "",
    password: "",
  });
  const [errorState, setErrorState] = useState<ErrorState>({
    emailWarning: "",
    passwordWarning: "",
  });

  function clearErrorState() {
    if (
      errorState.emailWarning.length > 0 ||
      errorState.passwordWarning.length > 0
    ) {
      setErrorState(() => {
        return {
          emailWarning: "",
          passwordWarning: "",
        };
      });
    }
  }

  function validateLoginInfo() {
    let passwordWarning = "";
    let emailWarning = "";
    // if (loginInfo.password.length < 8) {
    //   passwordWarning = `this needs ${
    //     8 - loginInfo.password.length
    //   } more characters`;
    // } else if (!/[0-9]/.test(loginInfo.password)) {
    //   passwordWarning = "this needs a number";
    // } else if (!/[a-zA-Z]/.test(loginInfo.password)) {
    //   passwordWarning = "this needs a letter";
    // }
    // if (!/.+@.+\..+/.test(loginInfo.email)) {
    //   emailWarning = "valid email required";
    // }
    setErrorState(() => {
      return {
        emailWarning,
        passwordWarning,
      };
    });
    return loginInfo.email.length > 0 && passwordWarning.length === 0;
  }

  function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateLoginInfo()) {
      const formData = new FormData();
      formData.append("email", loginInfo.email);
      formData.append("password", loginInfo.password);
      login(formData)
        .then((resp) => {
          props.startSession(resp.email);
          props.dialogRef.current?.close();
        })
        .catch((err: Error) => {
          let emailWarning = "";
          let passwordWarning = "";
          if (err.message.includes("email")) {
            emailWarning = err.message.includes("email") ? err.message : "";
          }
          if (err.message.includes("password")) {
            passwordWarning = err.message.includes("password")
              ? err.message
              : "";
          }
          if (!emailWarning && !passwordWarning) {
            // show generic error??
          }
          setErrorState(() => {
            return {
              emailWarning,
              passwordWarning,
            };
          });
        });
    }
  }

  return (
    <>
      <div className="flex justify-between items-start">
        <h3 className="text-xl mb-4">Login</h3>
        <button
          className="text-gray-800"
          onClick={() => {
            props.dialogRef.current?.close();
          }}
        >
          &times;
        </button>
      </div>
      <form onSubmit={submitForm}>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <label htmlFor="email">Email: </label>
            <input
              className="border border-black"
              type="email"
              name="email"
              id="email"
              value={loginInfo?.email}
              onChange={(e) => {
                setLoginInfo((prevState) => {
                  clearErrorState();
                  return {
                    ...prevState,
                    email: e.target.value,
                  };
                });
              }}
            />
            <p className="text-xs text-red-500">
              {errorState.emailWarning.length > 0 && errorState.emailWarning}
            </p>
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password: </label>
            <input
              className="border border-black"
              type="password"
              name="password"
              id="password"
              value={loginInfo?.password}
              onChange={(e) => {
                setLoginInfo((prevState) => {
                  clearErrorState();
                  return {
                    ...prevState,
                    password: e.target.value,
                  };
                });
              }}
            />
            <p className="text-xs text-red-500">
              {errorState.passwordWarning.length > 0 &&
                errorState.passwordWarning}
            </p>
            <p className="w-40 text-xs">
              *Passwords must contain at least eight characters, including at
              least 1 letter and 1 number.
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-x-5 my-4">
          <button
            className="bg-white border border-gray-800 p-2 hover:bg-gray-300"
            type="button"
            onClick={() => {
              props.dialogRef.current?.close();
            }}
          >
            close
          </button>
          <button className="bg-white border border-gray-800 p-2 hover:bg-gray-300">
            login
          </button>
        </div>
        <hr className="border-t-2 border-t-black" />
        <div className="text-center mt-6">
          <a
            className="bg-white border border-gray-800 p-2 hover:bg-gray-300"
            href={"http://localhost:8080/v1/auth/google"}
          >
            Login with Google
          </a>
        </div>
      </form>
    </>
  );
}
