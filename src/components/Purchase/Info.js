import React, { useEffect, useRef } from "react";
import Sidebar from "../Sidebar/Sidebar";
import CheckIcon from "../../assets/check-icon.svg";

function Info() {
  const hasOpenedDiscord = useRef(false);

  useEffect(() => {
    if (!hasOpenedDiscord.current) {
      const newWindow = window.open(
        "https://discord.gg/ya3maKeF73",
        "_blank",
        "noopener,noreferrer"
      );
      if (newWindow) {
        newWindow.opener = null;
        window.focus();
      }
      hasOpenedDiscord.current = true;
    }
  }, []);

  return (
    <div className="bg-[#121212] flex w-full">
      <Sidebar />
      <div className="flex flex-col text-white bg-[rgba(23, 23, 23)] w-full overflow-hidden">
        <div className="w-full flex flex-col items-center mt-20">
          <div className="flex justify-between w-full px-20">
            <div className=""></div>
            <h1 className="font-bold text-4xl">Welcome</h1>
            <div className=""></div>
          </div>
          <span className="text-[#eaeaea] text-center max-w-[600px] text-base font-medium mt-4">
            Thank you for subscribing! Here's how to get started.
          </span>
        </div>

        <div className="flex justify-center w-full mt-12">
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.2)",
            }}
            className="w-[500px] px-6 py-8 rounded-2xl"
          >
            <div className="relative rounded-t-lg text-xl font-semibold overflow-hidden mb-6 uppercase text-center py-3.5 shadow-2xl flex items-center justify-center">
              <h1 className="text-xl">How to Login</h1>
            </div>
            <ul className="h-full w-full gap-4 px-8 py-6 flex flex-col">
              <li className="flex gap-2 items-center">
                <img className="w-6 h-auto" src={CheckIcon} alt="Check Icon" />
                <span>Click 'Forgot Password' on the login page</span>
              </li>
              <li className="flex gap-2 items-center">
                <img className="w-6 h-auto" src={CheckIcon} alt="Check Icon" />
                <span>Use your Whop email to request a password reset</span>
              </li>
              <li className="flex gap-2 items-center">
                <img className="w-6 h-auto" src={CheckIcon} alt="Check Icon" />
                <span>Check your email and click the reset password link</span>
              </li>
              <li className="flex gap-2 items-center">
                <img className="w-6 h-auto" src={CheckIcon} alt="Check Icon" />
                <span>Create a new password and log in</span>
              </li>
            </ul>

            <div className="flex flex-col justify-between items-center mt-8 mb-3 px-4 py-6">
              <h2 className="text-xl font-semibold mb-4">Join Our Community</h2>

              <a
                href="https://discord.gg/ya3maKeF73"
                target="_blank"
                rel="noopener noreferrer"
                className="flex hover:bg-red-600 px-3 py-2.5 rounded-lg font-medium items-center justify-center text-xl z-50 transition-all w-full mx-auto mb-2 text-center bg-white/5"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Join Discord Server
              </a>
              <h2 className="text-sm font-normal mt-2 text-center text-gray-600">
                Once joined, please message admins or open a ticket for full
                access to the server.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
