import React from "react";
import { ButtonEditorComponent } from "../editor/ButtonEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionPricingComponent() {

  return (
    <section className="section section-lg">
      <div className="container text-center">
        <h2><TextEditorComponent id={`pricing-title`} /></h2>
        <div className="row no-gutters justify-content-center">
          {
            [
              { id: "pricing-1", className: "price-box-decor-top" },
              { id: "pricing-2", className: "price-box-1-primary" },
              { id: "pricing-3", className: "price-box-decor-bottom" }
            ]
            .map((e, i) => (
              <div key={e.id} className="col-md-4">
                <div className={`price-box-1 ${e.className}`}>
                  <div className="title">
                    <TextEditorComponent id={`${e.id}-title`} />
                    </div>
                  <div className="exeption">
                    <TextEditorComponent id={`${e.id}-description`} />
                  </div>
                  <div className="heading-3 price">
                    <TextEditorComponent id={`${e.id}-price`} />
                  </div>
                  <ButtonEditorComponent id="pricing-button"></ButtonEditorComponent>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
}

export default SectionPricingComponent;