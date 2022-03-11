import React from "react";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionOurValueComponent() {

  return (
    <section className="section section-lg section-decorate section-decorate-1">
      <div className="container text-center">
        <h2>
          <TextEditorComponent id="our-values-title"></TextEditorComponent>
        </h2>
        <div><TextEditorComponent id="our-values-description"></TextEditorComponent></div>
        <div className="row row-40 justify-content-center number-counter">
        {
          [ 
            { id: "our-values-1", icon: "mercury-icon-user" }, 
            { id: "our-values-2", icon: "mercury-icon-gear" }, 
            { id: "our-values-3", icon: "mercury-icon-target-2" }, 
            { id: "our-values-4", icon: "mercury-icon-lightbulb-gears" }, 
          ]
          .map((e) => (
            <div className="col-sm-6 col-lg-3 wow fadeInLeft" key={e.id}>
              <div className="blurb-icon-fill">
                <div className={`icon ${e.icon}`}><span className="index-counter"></span></div>
                <h5 className="title">
                  <TextEditorComponent id={`${e.id}-title`}></TextEditorComponent>
                </h5>
                <div className="exeption">
                  <TextEditorComponent id={`${e.id}-description`}></TextEditorComponent>
                </div>
              </div>
            </div>
          ))
        }
        </div>
      </div>
    </section>
  );
}

export default SectionOurValueComponent;