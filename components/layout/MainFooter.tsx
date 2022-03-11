import Link from "next/link";
import React, { ReactNode, SyntheticEvent, useState } from "react";
import { ImageEditorComponent } from "../editor/ImageEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";
import { useStore } from "../../state-management/useStore";

function MainFooter() {
  const { getImageByKey, type, onEdit, editId, setEditId, setType } = useStore();

  function getImageSrc(rawSrc: string) {
    var src = rawSrc?.replace("https://crpyto.damaral.my.id/", "https://gql.joinchampingtrading.com/")
    return src;
  }

  return (
    <footer className="section footer-2">
      <div className="container">
        <div className="row row-40">
          <div className="col-md-6 col-lg-3">
            <h5 className="title">
              <Link passHref href="/">
                <span className="footer-logo">
                  <TextEditorComponent id="footer-1-title" />
                </span>
              </Link>
            </h5>
            <div>
              <TextEditorComponent id="footer-1-description" />
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <h5 className="title">
              <TextEditorComponent id="footer-2-title" />
            </h5>
            <ul className="contact-box">
              <li>
                <div className="unit unit-horizontal unit-spacing-xxs">
                  <div className="unit-left"><span className="icon mdi mdi-map-marker"></span></div>
                  <div className="unit-body">
                    <div>
                      <TextEditorComponent id="footer-2-address" />
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <div className="unit unit-horizontal unit-spacing-xxs">
                  <div className="unit-left"><span className="icon mdi mdi-phone"></span></div>
                  <div className="unit-body">
                    <ul className="list-phones">
                      <li>
                        <div>
                          <TextEditorComponent id="footer-2-phone" />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <div className="unit unit-horizontal unit-spacing-xxs">
                  <div className="unit-left"><span className="icon mdi mdi-email-outline"></span></div>
                  <div className="unit-body">
                    <div>
                      <TextEditorComponent id="footer-2-email" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div className="group-md group-middle social-items">
              <a className="icon icon-md novi-icon mdi mdi-facebook" href="#"></a>
              <a className="icon icon-md novi-icon mdi mdi-twitter" href="#"></a>
              <a className="icon icon-md novi-icon mdi mdi-instagram" href="#"></a>
              <a className="icon icon-md novi-icon mdi mdi-facebook-messenger" href="#"></a>
              <a className="icon icon-md novi-icon mdi mdi-linkedin" href="#"></a>
              <a className="icon icon-md novi-icon mdi mdi-snapchat" href="#"></a>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <h5 className="title">Gallery</h5>
            <ul className="instafeed instagram-gallery" data-lightgallery="group">
              {
                ["gallery-1", "gallery-2", "gallery-3", "gallery-4", "gallery-5", "gallery-6"]
                .map((e) => (
                  <li key={e}>
                    <span className="instagram-item">
                      <div>
                        <ImageEditorComponent id={`${e}-image`} />
                      </div>
                    </span>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="col-md-6 col-lg-3">
            <h5 className="title">
              <TextEditorComponent id="footer-3-title" />
            </h5>
            <div>
              <TextEditorComponent id="footer-3-description" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;