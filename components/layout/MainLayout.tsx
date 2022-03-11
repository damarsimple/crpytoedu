import React, { useEffect, useState } from "react";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";
import { Meta } from "../Meta";
import { FormEditorComponent } from "../editor/FormEditorComponent";
import { useStore } from "../../state-management/useStore";
import { Grid } from "@mui/material";

export type MainLayoutProps = {
  showFooter?: boolean
  children: React.ReactNode
  showHeader?: boolean
}

function MainLayout ({ showFooter, children, showHeader }: MainLayoutProps) {
  const { onEdit } = useStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const core = document.createElement("script");
    core.src = "/js/core.min.js";

    const script = document.createElement("script");
    script.src = "/js/script.js";

    document.body.appendChild(core);

    setTimeout(() => {
      document.body.appendChild(script);
      setLoading(false);
    }, 200);

    return () => {
      if (document.body.contains(core)) {
        document.body.removeChild(core);
        document.body.removeChild(script); 
      }
    }
  }, [])

  return (
    <>
      <Meta></Meta>

      {(!loading) && (
        <div className="col-lg-12 row m-0 p-0">

          {onEdit && (
            <div className="col-5 col-md-3 col-lg-2 m-0 p-0 d-none d-lg-block" style={{ zIndex: 1000 }}>
              <FormEditorComponent></FormEditorComponent>
            </div>
          )}

          <div className={"page col m-0 p-0 " + (!loading? "animated" : "")} 
            style={onEdit ? { overflow: "auto", height: "100vh" } : {}}>
            <>
              <MainHeader></MainHeader>

              { children }

              <MainFooter></MainFooter>
            </>
          </div>
        </div>
      )}
    </>
  );
}

export default MainLayout;