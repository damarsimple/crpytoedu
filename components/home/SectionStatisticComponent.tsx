import React from "react";
import { ImageEditorComponent } from "../editor/ImageEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionStatisticComponent() {

  return (
    <section className="section section-lg bg-primary-dark">
      <div className="container">
        <h2 className="text-center">
          <TextEditorComponent className="" id="stats-title"> </TextEditorComponent>
        </h2>
        <div className="row row-20 justify-content-center justify-content-lg-between">
          <div className="col-md-12 col-lg-6 wow fadeIn">
            <blockquote className="quote quote-default">
              <div className="quote-icon mdi mdi-format-quote"></div>
              <div className="quote-body">
                <q className="heading-6">
                  <TextEditorComponent className="" id="stats-content"> </TextEditorComponent>
                </q>
              </div>
              <div className="quote-meta">
                <div className="author">
                  <cite>
                    <TextEditorComponent className="" id="stats-founder"> </TextEditorComponent>
                  </cite>
                </div>
                <div className="position">
                  <TextEditorComponent className="" id="stats-founder-position"> </TextEditorComponent>
                </div>
              </div>
            </blockquote>
          </div>
          <div className="col-md-12 col-lg-6 col-xxl-4 wow fadeIn">
            <ImageEditorComponent className="" id={`stats-image`}> </ImageEditorComponent>
            <TextEditorComponent className="" id="stats-image-description"> </TextEditorComponent>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionStatisticComponent;