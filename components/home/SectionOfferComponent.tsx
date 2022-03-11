import React from "react";
import { IconEditorComponent } from "../editor/IconEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionOfferComponent() {

  return (
    <section className="section context-dark">
      <div className="row row-flex no-gutters">
      {[
        {
          id: "advertise-1",
          className: "",
        },
        {
          id: "advertise-2",
          className: "blurb-boxed-dark",
        },
        {
          id: "advertise-3",
          className: "blurb-boxed-darker",
        },
        {
          id: "advertise-4",
          className: "blurb-boxed-darkest",
        },
      ].map((e) => (
        <div className="col-md-6 col-lg-3" key={e.id}>
          <div className={`blurb-boxed-2 ${e.className}`}>
            <IconEditorComponent className="" id={`${e.id}-image`}> </IconEditorComponent>
            {/* <div className={`icon mdi ${e.id}-image`}></div> */}
            <div>
              <TextEditorComponent className="title" id={`${e.id}-title`}> </TextEditorComponent>
            </div>
            <TextEditorComponent className="exeption" id={`${e.id}-description`}> </TextEditorComponent>
          </div>
        </div>
      ))}
      </div>
    </section>
  );
}

export default SectionOfferComponent;