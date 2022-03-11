import React from "react";
import { IconEditorComponent } from "../editor/IconEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionWhyChooseUsComponent() {

  return (
    <section className="section section-lg section-decorate">
      <div className="container">
        <div className="block-lg text-center">
          <h2>
            <TextEditorComponent className="" id="advantages-title"> </TextEditorComponent>
          </h2>
          <TextEditorComponent className="" id="advantages-description"> </TextEditorComponent>
        </div>
        <div className="row row-30 row-xxl-60">
          {[ 
            {id: "advantages-1", icon: "mercury-icon-money-3"},
            {id: "advantages-2", icon: "mercury-icon-lightbulb-gears"},
            {id: "advantages-3", icon: "mercury-icon-touch"},
            {id: "advantages-4", icon: "mercury-icon-group"},
            {id: "advantages-5", icon: "mercury-icon-social"},
            {id: "advantages-6", icon: "mercury-icon-chart-up"}
          ].map((e) => (
            <div className="col-sm-6 col-md-4 wow fadeInLeft" key={e.id}>
              <div className="blurb-image">
                <div className={`icon ${e.icon}`}></div>
                {/* <IconEditorComponent className="" id={`${e}-image`}> </IconEditorComponent> */}
                <h6 className="title">
                  <TextEditorComponent className="" id={`${e.id}-title`}> </TextEditorComponent>
                </h6>
                <TextEditorComponent className="exeption" id={`${e.id}-description`}> </TextEditorComponent>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SectionWhyChooseUsComponent;