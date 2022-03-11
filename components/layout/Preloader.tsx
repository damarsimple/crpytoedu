import React, { useEffect, useState } from "react";

export type PreloaderProps = {
  loading?: boolean
}

function Preloader({ loading }: PreloaderProps) {

  return (
    <div className={"preloader " + (!loading? "loaded" : "")}>
      <div className="preloader-body">
        <div className="cssload-container">
          <div className="cssload-speeding-wheel"></div>
        </div>
        <p>Loading...</p>
      </div>
    </div>
  );
}

export default Preloader;