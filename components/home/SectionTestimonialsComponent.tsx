import React from "react";
import { ImageEditorComponent } from "../editor/ImageEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionTestimonialsComponent() {

  return (
    <section className="section section-lg bg-gray-100" id="testimonials">
      <div className="container text-center">
        <h2>
          <TextEditorComponent className="" id={`testimonials-name`}> </TextEditorComponent>
        </h2>
        <div className="owl-carousel text-left" data-items="1" data-md-items="2" data-dots="true" data-nav="false" data-stage-padding="0" data-loop="true" data-margin="30" data-mouse-drag="false" data-autoplay="true">
        {
          [ "testimonials-1", "testimonials-2", "testimonials-3", "testimonials-4", "testimonials-5", "testimonials-6"]
          .map((e) => (
            <blockquote className="quote quote-boxed" key={e}>
              <div className="quote-meta">
                <ul className="list-icons">
                  <li><div className="icon mdi mdi-star"></div></li><li><div className="icon mdi mdi-star"></div></li><li><div className="icon mdi mdi-star"></div></li><li><div className="icon mdi mdi-star"></div></li><li><div className="icon mdi mdi-star-half"></div></li>
                </ul>
                <div className="time">
                  <TextEditorComponent className="" id={`${e}-date`}> </TextEditorComponent>
                </div>
              </div>
              <q>
                <TextEditorComponent className="" id={`${e}-content`}> </TextEditorComponent>
              </q>
              <div className="quote-author">
                <div className="author-media">
                  <ImageEditorComponent className="" id={`${e}-image`}> </ImageEditorComponent>
                </div>
                <div className="author-body">
                  <div className="author">
                    <cite>
                      <TextEditorComponent className="" id={`${e}-client-name`}> </TextEditorComponent>
                    </cite>
                  </div>
                  <div className="position">
                    <TextEditorComponent className="" id={`${e}-client-position`}> </TextEditorComponent>
                  </div>
                </div>
              </div>
            </blockquote>
          ))
        }
        </div>
      </div>
    </section>
  );
}

export default SectionTestimonialsComponent;