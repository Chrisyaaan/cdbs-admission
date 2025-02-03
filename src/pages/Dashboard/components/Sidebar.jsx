import logo from "../../../assets/images/logo.png";
import accountIcon from "../../../assets/images/account-icon.png";
import book from "../../../assets/images/literature-review.png";
import settings from "../../../assets/images/settings.png";
import cn from "classnames";

import SideLink from "./SideLink";
import UserContext from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import Swal from "sweetalert2";
import useAuthStore from "../../../store/authentication/authStore";
import useGreeting from "../../../hooks/useGreeting";
import useSideBarStore from "../../../store/sideBar/sideBarStore";

function Sidebar() {
  const {greeting} = useGreeting()
  const {showSideBar, setShowSideBar} = useSideBarStore()
  // const { user } = useContext(UserContext);
  const {user} = useAuthStore()
  const navigate = useNavigate();  


  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSideBar(false); // Close sidebar
      }
    };

    // Add event listener

      document.addEventListener("mousedown", handleClickOutside);


    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSideBar]);

  return (

      <aside className={cn(
        "side-dashboard hidden xl:flex flex-col justify-between absolute top-0 right-0 h-full",
        { "!flex": showSideBar }
      )} 
        ref={sidebarRef}
      >
        <div className="sidebar-container">
          <div className="welcome-container border-b-2 border-b-black xl:border-b-0">
            <img src={logo} className="w-[12rem] xl:w-[5rem] xl:pe-[1em]" />
            <div className="welcome-text hidden xl:block">
              <h2>Welcome back!</h2>
              <h3>
                {greeting}, {user["firstName"]}!
              </h3>
            </div>
          </div>
          <div
            onClick={() => {
              // setPage("profile");
              console.log(user);
            }}
          >
            <SideLink icon={accountIcon} labelText={"My Account"} />
          </div>
          {
            //<SideLink icon={book} labelText={"Contact Directory"} />
            //<SideLink icon={settings} labelText={"Settings"} />
          }
        </div>
        <button
          className="btn-blue btn-logout btn"
          onClick={async () => {
            var result = await Swal.fire({
              title: "Log out?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes",
              cancelButtonColor: "No",
            });
            if (result.isConfirmed) {
              localStorage.clear();
              navigate(0);
            } else {
              return;
            }
            // clearModalRegister();
          }}
        >
          Logout
        </button>
      </aside>

  );
}

export default Sidebar;
