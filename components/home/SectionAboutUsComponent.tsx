import React from "react";
import { ButtonEditorComponent } from "../editor/ButtonEditorComponent";
import { ImageEditorComponent } from "../editor/ImageEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionAboutUsComponent() {

  return (
    <section className="section section-lg bg-gray-100" id="about">
      <div className="container">
        <div className="block-lg text-center">
          <h2>
            <TextEditorComponent className="" id="about-title"> </TextEditorComponent>
          </h2>
          <TextEditorComponent className="" id="about-description"> </TextEditorComponent>
        </div>
        <div className="row row-20 justify-content-center justify-content-lg-between">
          <div className="col-md-10 col-lg-6 col-xl-7 wow fadeIn">
            <ImageEditorComponent className="" id="about-image"> </ImageEditorComponent>
          </div>
          <div className="col-md-10 col-lg-6 col-xl-5">
            <div className="text-block-2">
              <TextEditorComponent className="" id="about-content"> </TextEditorComponent>
              <div className="progress-linear-wrap mt-3">
                <article className="progress-linear">
                  <div className="progress-header">
                    <TextEditorComponent className="" id="about-article-1"> </TextEditorComponent>
                    <span className="progress-value">100</span>
                  </div>
                  <div className="progress-bar-linear-wrap">
                    <div className="progress-bar-linear"></div>
                  </div>
                </article>
                <article className="progress-linear">
                  <div className="progress-header">
                    <TextEditorComponent className="" id="about-article-2"> </TextEditorComponent>
                    <span className="progress-value">100</span>
                  </div>
                  <div className="progress-bar-linear-wrap">
                    <div className="progress-bar-linear"></div>
                  </div>
                </article>
              </div>
              <ButtonEditorComponent id="about-button"></ButtonEditorComponent>
              {/* <a className="button button-lg button-gradient" href="#"><span>More Details</span></a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionAboutUsComponent;