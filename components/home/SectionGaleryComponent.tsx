import React from "react";
import { ImageEditorComponent } from "../editor/ImageEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";
import { useStore } from "../../state-management/useStore";

function SectionGaleryComponent() {
  const { getImageByKey, type, onEdit, editId, setEditId, setType } = useStore();

  function getImageSrc(rawSrc: string) {
    var src = rawSrc?.replace("https://crpyto.damaral.my.id/", "https://gql.joinchampingtrading.com/")
    return src;
  }

  const WrapElementGralery = ({ children, href } : { children: React.ReactNode, href: string }) => {
      if (onEdit) {
        return (
          <div>
            { children }
          </div>
        )
      } else {
        return (
          <a className="gallery-item" data-lightgallery="item" href={href}>
            { children }
          </a>
        )
      }
  }

  return (
    <section className="section section-lg bg-gray-100" id="gallery">
      <div className="container text-center">
        <h2><TextEditorComponent id={`gallery-title`}></TextEditorComponent></h2>
        <div className="row">
          <div className="col-lg-12 text-left">
            <div className="isotope" data-isotope-layout="fitRows" data-isotope-group="gallery" data-lightgallery="group">
              <div className="row">
              {
                [
                  "gallery-1",
                  "gallery-2",
                  "gallery-3",
                  "gallery-4",
                  "gallery-5",
                  "gallery-6",
                  "gallery-7",
                  "gallery-8",
                  "gallery-9",
                ].map((e) => (
                  <div key={e} className="col-sm-6 col-lg-4 isotope-item" data-filter="*">
                    <WrapElementGralery href={getImageSrc(getImageByKey(`${e}-image`).src)}>
                      <ImageEditorComponent id={`${e}-image`} ></ImageEditorComponent>
                      <div className="gallery-item-content">
                        <div className="heading-5 title">
                          <TextEditorComponent id={`${e}-title`}></TextEditorComponent>
                        </div>
                        <div className="exeption">
                          <TextEditorComponent id={`${e}-description`}></TextEditorComponent>
                        </div>
                      </div>
                    </WrapElementGralery>
                  </div>
                ))
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionGaleryComponent;