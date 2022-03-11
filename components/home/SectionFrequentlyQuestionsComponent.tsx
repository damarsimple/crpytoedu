import React from "react";
import { ButtonEditorComponent } from "../editor/ButtonEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionFrequentlyQuestionsComponent() {

  return (
    <section className="section section-lg">
      <div className="container text-center">
        <h2><TextEditorComponent id={`faq-title`} /></h2>
        <div className="row row-flex row-40 number-counter text-left">
          {
            ["faq-1", "faq-2", "faq-3"].map((e) => (
              <div key={e} className="col-sm-12 col-lg-4 wow fadeIn">
                <div className="text-block-lined">
                  <h5 className="title">
                    <TextEditorComponent id={`${e}-title`}  />
                  </h5>
                  <div>
                    <TextEditorComponent id={`${e}-description`}  />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <div className="button-wrap-lg">
          <ButtonEditorComponent id="faq-button"></ButtonEditorComponent>
        </div>
      </div>
    </section>
  );
}

export default SectionFrequentlyQuestionsComponent;