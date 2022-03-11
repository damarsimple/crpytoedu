import React from "react";
import { ButtonEditorComponent } from "../editor/ButtonEditorComponent";
import { ImageEditorComponent } from "../editor/ImageEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionBlogsComponent() {

  return (
    <section className="section section-lg bg-gray-100">
      <div className="container text-center">
        <h2>
          <TextEditorComponent id={`blog-title`}></TextEditorComponent>
        </h2>
        <div className="row row-flex row-40 justify-content-center number-counter text-left wow fadeInUp">
          {
            ["blog-1", "blog-2", "blog-3", "blog-4"]
            .map((e) => (
              <div key={e} className="col-sm-6 col-lg-3">
                <article className="post-classic-2">
                  <a className="media-wrapper" href="#">
                    <ImageEditorComponent id={`${e}-image`}></ImageEditorComponent>
                  </a>
                  <div className="post-meta-main">
                    <div className="post-meta-item">
                      <ul className="list-tags">
                        <li>
                          <a className="tag" href="#">Terbaru</a>
                        </li>
                      </ul>
                    </div>
                    <div className="post-meta-item">
                      <div className="post-author">
                        <span>by </span> 
                        <a href={`#`}>
                          <TextEditorComponent id={`${e}-author`}></TextEditorComponent>
                        </a>
                      </div>
                    </div>
                  </div>
                  <h6 className="post-title">
                    <a href={`/blog/${e}`}>
                      <TextEditorComponent id={`${e}-title`}></TextEditorComponent>
                    </a>
                  </h6>
                  <div className="post-exeption">
                    <TextEditorComponent id={`${e}-description`}></TextEditorComponent>
                  </div>
                  <div className="post-date">
                    <TextEditorComponent id={`${e}-date`}></TextEditorComponent>
                  </div>
                </article>
              </div>
            ))
          }
        </div>
        <div className="button-wrap-lg">
          <ButtonEditorComponent id="blog-button"></ButtonEditorComponent>
        </div>
      </div>
    </section>
  );
}

export default SectionBlogsComponent;