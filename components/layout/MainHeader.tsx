import Link from "next/link";
import React, { ReactNode, SyntheticEvent, useState } from "react";
import { useUserStore } from "../../store/user";
import { FormEditorComponent } from "../editor/FormEditorComponent";
import { useStore } from "../../state-management/useStore";

function MainHeader() {
  const { user } = useUserStore();
  const { onEdit } = useStore();

  return (
    <header className="section page-header">
      <div className="rd-navbar-wrap rd-navbar-absolute">
        <nav className="rd-navbar rd-navbar-creative" data-layout="rd-navbar-fixed" data-sm-layout="rd-navbar-fixed" data-md-layout="rd-navbar-fixed" data-md-device-layout="rd-navbar-fixed" data-lg-layout="rd-navbar-static" data-lg-device-layout="rd-navbar-static" data-xl-layout="rd-navbar-static" data-xl-device-layout="rd-navbar-static" data-lg-stick-up-offset="20px" data-xl-stick-up-offset="20px" data-xxl-stick-up-offset="20px" data-lg-stick-up="true" data-xl-stick-up="true" data-xxl-stick-up="true">
          <div className="rd-navbar-main-outer">
            <div className="rd-navbar-main">
              {/* <!-- RD Navbar Panel--> */}
              <div className="rd-navbar-panel">
                {/* <!-- RD Navbar Toggle--> */}
                <button className="rd-navbar-toggle" data-rd-navbar-toggle=".rd-navbar-nav-wrap"><span></span></button>
                {/* <!-- RD Navbar Brand--> */}
                <div className="rd-navbar-brand">
                  {/* <Link href={"/"}> */}
                    <a className="h4 font-weight-bolder text-white" style={{ cursor: "pointer" }} href="/">
                      {process.env.NEXT_PUBLIC_APP_NAME}
                    </a>
                  {/* </Link> */}
                </div>
              </div>
              <div className="rd-navbar-main-element">
                <div className="rd-navbar-nav-wrap">
                  <ul className="rd-navbar-nav">
                    <li className={`rd-nav-item active ${onEdit ? "d-lg-inline-block d-none" : ""}`}><a className="rd-nav-link" href="#home">Home</a></li>
                    <li className={`rd-nav-item ${onEdit ? "d-lg-inline-block d-none" : ""}`}><a className="rd-nav-link" href="#about">About</a></li>
                    <li className={`rd-nav-item ${onEdit ? "d-lg-inline-block d-none" : ""}`}><a className="rd-nav-link" href="#team">Team</a></li>
                    <li className={`rd-nav-item ${onEdit ? "d-lg-inline-block d-none" : ""}`}><a className="rd-nav-link" href="#testimonials">Testimonials</a></li>
                    <li className={`rd-nav-item ${onEdit ? "d-lg-inline-block d-none" : ""}`}><a className="rd-nav-link" href="#gallery">Gallery</a></li>
                    {/* <li className="rd-nav-item"><a className="rd-nav-link" href="#contacts">Contacts</a></li> */}
                    {user ? (
                      <>
                        <li className={`rd-nav-item btn btn-primary p-0 px-3 rounded ${onEdit ? "d-lg-inline-block d-none" : ""}`}>
                          <Link href={user?.roles?.toLocaleLowerCase() + "s"}> 
                            <a className="rd-nav-link">Profile</a> 
                          </Link>
                        </li>
                      </>
                    ) : (
                      <li className={`rd-nav-item ${onEdit ? "d-lg-inline-block d-none" : ""}`}>
                        <Link href="/login"> 
                          <a className="rd-nav-link">Login</a> 
                        </Link>
                      </li>
                    )}

                    <div className="col-12 m-0 p-0 d-lg-none d-block">
                      <FormEditorComponent></FormEditorComponent>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default MainHeader;