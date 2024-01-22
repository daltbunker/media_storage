import { useState } from "react";

type Props = {
  text: string;
  loggedIn: boolean;
  email: string;
  endSession: () => void;
};

export function Header(props: Props) {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="text-white flex justify-between items-end border-b border-gray-600 py-2 mb-8">
      <h1 className="text-2xl">{props.text}</h1>
      {props.loggedIn && (
        <div className="relative">
          <button
            onClick={() => {
              setShowLogout((prevState) => !prevState);
            }}
          >
            {props.email}
          </button>
          {showLogout && (
            <div className="bg-white absolute">
              <button
                onClick={() => {
                  setShowLogout(false);
                  props.endSession();
                }}
                className="text-black right-2 px-6 py-1 hover:bg-gray-300"
              >
                logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
