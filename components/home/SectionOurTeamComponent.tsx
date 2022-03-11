import React from "react";
import { ImageEditorComponent } from "../editor/ImageEditorComponent";
import { TextEditorComponent } from "../editor/TextEditorComponent";

function SectionOurTeamComponent() {

  return (
    <section className="section section-lg" id="team">
      <div className="container text-center">
        <h2>
          <TextEditorComponent className="" id={`team-title`}> </TextEditorComponent>
        </h2>
        <div className="owl-carousel text-left" data-items="1" data-sm-items="2" data-lg-items="3" data-xl-items="4" data-dots="true" data-nav="false" data-stage-padding="15" data-loop="false" data-margin="30" data-mouse-drag="false">
        {
          ["team-1", "team-2", "team-3", "team-4"].map((e) => (
            <div className="thumbnail-1" key={e}>
              <div className="media-wrap">
                {/* <img src="images/team-1-270x270.jpg" alt="" width="270" height="270"/> */}
                <ImageEditorComponent className="" id={`${e}-image`}> </ImageEditorComponent>
              </div>
              <div className="title">
                <TextEditorComponent className="" id={`${e}-name`}> </TextEditorComponent>
              </div>
              <div className="position">
                <TextEditorComponent className="" id={`${e}-position`}> </TextEditorComponent>
              </div>
              <div className="exeption">
                <TextEditorComponent className="" id={`${e}-description`}> </TextEditorComponent>
              </div>
              <div className="group group-middle social-items"><a className="icon icon-md icon-gray-400 novi-icon mdi mdi-facebook" href="#"></a><a className="icon icon-md icon-gray-400 novi-icon mdi mdi-twitter" href="#"></a><a className="icon icon-md icon-gray-400 novi-icon mdi mdi-instagram" href="#"></a><a className="icon icon-md icon-gray-400 novi-icon mdi mdi-facebook-messenger" href="#"></a><a className="icon icon-md icon-gray-400 novi-icon mdi mdi-linkedin" href="#"></a><a className="icon icon-md icon-gray-400 novi-icon mdi mdi-snapchat" href="#"></a></div>
            </div>
          ))
        }
        </div>
      </div>
    </section>
  );
}

export default SectionOurTeamComponent;