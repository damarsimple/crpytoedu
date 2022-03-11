import React from "react";
import { useStore } from "../../state-management/useStore";
import { ButtonEditorComponent } from "../editor/ButtonEditorComponent";
import { ImageEditorComponent } from "../editor/ImageEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionSwiperComponent() {

  return (
    <section className="section swiper-container swiper-slider swiper-slider-2 swiper-bg" id="home" data-loop="true" data-autoplay="5500" data-simulate-touch="false" data-slide-effect="fade">
        <div className="swiper-img-block">
          <div className="swiper-img-block-inner">
            <ImageEditorComponent className="" id="main-image"> </ImageEditorComponent>
          </div>
        </div>
        <div className="swiper-wrapper text-center text-md-left">
          {
            ['main-description-1', 'main-description-2', 'main-description-3']
            .map((e) => (
              <div key={e} className="swiper-slide context-dark">
                <div className="swiper-slide-caption">
                  <div className="container">
                    <div className="row">
                      <div className="col-md-9 col-lg-7">
                        <h1 data-caption-animate="fadeInUp" data-caption-delay="100">
                          <TextEditorComponent className="font-weight-light" id={`${e}`}></TextEditorComponent>
                        </h1>
                        <div className="button-block" data-caption-animate="fadeInUp" data-caption-delay="150">
                          <ButtonEditorComponent id="main-button"></ButtonEditorComponent>
                        </div> 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <div className="swiper-meta">
          <ul className="links">
            <li><a className="icon icon-meta mdi mdi-facebook" href="#"></a></li>
            <li><a className="icon icon-meta mdi mdi-twitter" href="#"></a></li>
            <li><a className="icon icon-meta mdi mdi-instagram" href="#"></a></li>
            <li><a className="icon icon-meta mdi mdi-facebook-messenger" href="#"></a></li>
            <li><a className="icon icon-meta mdi mdi-linkedin" href="#"></a></li>
            <li><a className="icon icon-meta mdi mdi-snapchat" href="#"></a></li>
          </ul>
          <div className="contacts">
            <div className="icon mdi mdi-cellphone-iphone"></div>
              <div className="tel">
                <a href="tel:#">
                  <TextEditorComponent id="phone-number"> </TextEditorComponent>
                </a>
              </div>
            <div className="request">
              <a href="#modal" data-toggle="modal">
                <TextEditorComponent id={`call-us-context`}></TextEditorComponent>
              </a>
            </div>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </section>
  );
}

export default SectionSwiperComponent;