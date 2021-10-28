/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-css-tags */
/* eslint-disable @next/next/no-img-element */

import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";
import create from "zustand";
import { Autocomplete, Box, Grid, TextField } from "@mui/material";
// import FileInput from "../components/FileInput";
interface Store {
  selectedId: null | string;
  setSelectedId: (by: null | string) => void;
  textMap: Record<string, string>;
  setTextMap: (by: Record<string, string>) => void;
}

export const useStore = create<Store>((set, get) => ({
  selectedId: null,
  textMap: {},
  setTextMap: (textMap) => set({ textMap }),
  setSelectedId: (selectedId) => set({ selectedId }),
}));

const TEXT_TARGET = "span";

const Home: NextPage = () => {
  const { textMap, setTextMap, setSelectedId, selectedId } = useStore();
  useEffect(() => {
    const map: Record<string, string> = {};
    const main = document.querySelector("#main");
    if (main) {
      for (const x of main.querySelectorAll("a")) {
        //@ts-ignore
        x.href = "#";
      }
      for (const x of main.querySelectorAll("img")) {
        x.style.border = "2px solid black";
        const id = x.id;

        if (id.includes(" ")) console.log(id);

        x.onclick = (e) => {
          setSelectedId(id);
        };
      }
      for (const x of main.querySelectorAll(TEXT_TARGET)) {
        x.style.border = "2px solid black";

        const id = x.id;

        if (id && typeof id == "string") {
          //@ts-ignore
          map[id] = x.innerHTML;
          x.innerHTML = textMap[id] ?? x.innerHTML;
        } else {
          // console.log(x);
        }
        //@ts-ignore
        x.contentEditable = "true";
        //@ts-ignore
        x.onclick = (e) => {
          setSelectedId(id);
        };

        //@ts-ignore
        x.oninput = (e) => {
          //@ts-ignore
          if (id) {
            setTextMap({
              //@ts-ignore
              [id]: e.currentTarget.innerHTML.replace("<br>", "\n"),
            });
          }
        };
      }
    }

    setTextMap(map);
  }, []);

  const getEl = () =>
    selectedId ? document.querySelector(`#` + selectedId) : null;

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />
        <link rel="icon" href="images/favicon.ico" type="image/x-icon" />

        <link rel="stylesheet" href="css/fonts.css" />
      </Head>
      <div style={{ width: "20%", padding: 2 }}>
        <h2>{selectedId ?? "none"}</h2>
        {selectedId ? (
          <>
            {getEl()?.tagName?.toLowerCase() == "img" && (
              <>
                <TextField
                  label="Url Gambar"
                  variant="outlined"
                  onChange={(x) => {
                    const el = getEl();
                    if (el) {
                      //@ts-ignore
                      el.src = x.target.value;
                    }
                  }}
                />
                {/* <FileInput
                  name="new_pp"
                  label="Ubah Gambar"
                  accept="image/*"
                  fileable_id={"1"}
                  fileable_type={"App\\Models\\Page"}
                  roles={selectedId}
                  onUploaded={(x) => {
                    const el = getEl();
                    if (el) {
                      el.src = x.path;
                    }
                  }}
                /> */}
              </>
            )}
            {TEXT_TARGET.includes(getEl()?.tagName?.toLowerCase() ?? "") && (
              <>
                <Autocomplete
                  options={["Kalam", "Roboto"].map((e) => ({
                    label: e,
                    value: e,
                  }))}
                  fullWidth
                  onChange={(_: any, { value }: any) => {
                    const el = getEl();
                    console.log(el);
                    if (el) {
                      //@ts-ignore
                      el.style.color = value;
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      onChange={(x) => {
                        console.log(x.target.value);
                        const el = getEl();
                        console.log(el);
                        if (el) {
                          //@ts-ignore
                          el.style.color = x.target.value;
                        }
                      }}
                      {...params}
                      label="Font Type"
                    />
                  )}
                />
                <Autocomplete
                  options={["white", "red", "orange", "green"].map((e) => ({
                    label: e,
                    value: e,
                  }))}
                  fullWidth
                  onChange={(_: any, { value }: any) => {
                    const el = getEl();
                    console.log(el);
                    if (el) {
                      //@ts-ignore
                      el.style.color = value;
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      onChange={(x) => {
                        console.log(x.target.value);
                        const el = getEl();
                        console.log(el);
                        if (el) {
                          //@ts-ignore
                          el.style.color = x.target.value;
                        }
                      }}
                      {...params}
                      label="Warna"
                    />
                  )}
                />
                <Autocomplete
                  options={["10px", "20px", "30px"].map((e) => ({
                    label: e,
                    value: e,
                  }))}
                  fullWidth
                  onChange={(_: any, { value }: any) => {
                    const el = getEl();
                    console.log(el);
                    if (el) {
                      //@ts-ignore
                      el.style.fontSize = value;
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      onChange={(x) => {
                        console.log(x.target.value);
                        const el = getEl();
                        console.log(el);
                        if (el) {
                          //@ts-ignore
                          el.style.fontSize = x.target.value;
                        }
                      }}
                      {...params}
                      label="Ukuran Text"
                    />
                  )}
                />
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
      <div
        id="main"
        style={{ width: "80%", maxHeight: "100vh", overflowY: "auto" }}
      >
        <section
          className="section swiper-container swiper-slider swiper-slider-2 swiper-bg"
          id="home"
          style={{
            backgroundImage: "url('./images/swiper-bg.jpg')",
          }}
        >
          <Grid
            container
            spacing={1}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              paddingX: 20,
            }}
          >
            <Grid item xs={6}>
              <Box sx={{ marginLeft: "10px" }}>
                <h1
                  style={{
                    color: "white",
                  }}
                >
                  <span id="title-brand">Softlabs - Innovative Solutions</span>
                </h1>
                <div
                  className="button-block"
                  data-caption-animate="fadeInUp"
                  data-caption-delay={150}
                >
                  <a className="button button-lg button-gradient" href="#">
                    <span id="button-learn-more">Learn More</span>
                  </a>
                </div>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <div>
                <img id="images-1" src="images/swiper-img.png" alt="photo" />
              </div>
            </Grid>
          </Grid>

          <div className="swiper-meta">
            <ul className="links">
              <li>
                <a className="icon icon-meta mdi mdi-facebook" href="#" />
              </li>
              <li>
                <a className="icon icon-meta mdi mdi-twitter" href="#" />
              </li>
              <li>
                <a className="icon icon-meta mdi mdi-instagram" href="#" />
              </li>
              <li>
                <a
                  className="icon icon-meta mdi mdi-facebook-messenger"
                  href="#"
                />
              </li>
              <li>
                <a className="icon icon-meta mdi mdi-linkedin" href="#" />
              </li>
              <li>
                <a className="icon icon-meta mdi mdi-snapchat" href="#" />
              </li>
            </ul>
            <div className="contacts">
              <div className="icon mdi mdi-cellphone-iphone" />
              <div className="tel">
                <a href="tel:#">
                  <span id="telephone-number">1-800-1234-567</span>
                </a>
              </div>
              <div className="request">
                <a href="#modal" data-toggle="modal">
                  <span id="call-back"> Request a Call Back</span>
                </a>
              </div>
            </div>
            {/* Swiper Pagination*/}
            <div className="swiper-pagination" />
          </div>
        </section>
        {/* Advantages*/}
        <section className="section context-dark">
          <div className="row row-flex no-gutters">
            <div className="col-md-6 col-lg-3">
              <div className="blurb-boxed-2">
                <img src="" alt="" width={50} height={50} id="images-2" />
                <h6 className="title" id="advantages-1-title">
                  <span id="title-benefits-1">Mobile and Desktop Apps</span>
                </h6>
                <p className="exception" id="advantages-1-content">
                  <span id="benefits-content-1">
                    Our company delivers various types of mobile and desktop
                    software as well as custom solutions for businesses.
                  </span>
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="blurb-boxed-2 blurb-boxed-dark">
                <img src="" alt="" width={50} height={50} id="images-2" />
                <h6 className="title" id="advantages-2-title">
                  <span id="title-benefits-2">Corporate Solutions</span>
                </h6>
                <p className="exeption" id="advantages-2-content">
                  <span id="benefits-content-2">
                    Need specific software for your company? Our team is ready
                    to design and develop it for you!
                  </span>
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="blurb-boxed-2 blurb-boxed-darker">
                <img src="" alt="" width={50} height={50} id="images-3" />
                <h6 className="title" id="advantages-3-title">
                  <span id="title-benefits-3">24/7 Support</span>
                </h6>
                <p className="exeption" id="advantages-3-content">
                  <span id="benefits-content-3">
                    We also provide full 24/7 client support. In case you have a
                    problem with our apps, feel free to contact us anytime.
                  </span>
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="blurb-boxed-2 blurb-boxed-darkest">
                <p className="exeption">
                  <span id="benefits-title-4">Reliable Apps Since 2005</span>
                </p>
                <h5 className="title" id="advantages-4-title">
                  <span id="content-benefits-4">
                    We Can Design an App of Any Complexity for Your Company
                  </span>
                </h5>
                <a
                  className="button button-lg button-gradient"
                  href="#"
                  id="advantages-4-content"
                >
                  <span>Get a Quote</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* The Best Banking Choise*/}
        <section className="section section-lg section-decorate">
          <div className="container">
            <div className="block-lg text-center">
              <h2>
                <span id="best-1-title">Why Choose Us</span>
              </h2>
              <p id="best-1-content">
                <span id="why-choosing-soflabs">
                  Our clients have been choosing Softlabs for a number of
                  reasons including reliability, latest technologies, and
                  constant updates &amp; support. Read more about other
                  advantages below.
                </span>
              </p>
            </div>
            <div className="row row-30 row-xxl-60">
              <div className="col-sm-6 col-md-4 wow fadeInLeft">
                <div className="blurb-image">
                  <img height={70} width={70} alt="" src="" id={"images-x-0"} />
                  <h6 className="title" id="best-2-title">
                    <span id="title-question-1">Quick Results</span>
                  </h6>
                  <p className="exeption" id="best-2-content">
                    <span id-="content-question-1">
                      We work quickly and efficiently to provide the best
                      results.
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="col-sm-6 col-md-4 wow fadeInLeft"
                data-wow-delay="0.1s"
              >
                <div className="blurb-image">
                  <img height={70} width={70} alt="" src="" id={"images-x-1"} />
                  <h6 className="title" id="best-3-title">
                    <span id="title-question2">Powerful Apps</span>
                  </h6>
                  <p className="exeption" id="best-3-content">
                    <span id="content-question2">
                      Our team offers a wide variety of powerful and sustainable
                      apps.
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="col-sm-6 col-md-4 wow fadeInLeft"
                data-wow-delay="0.2s"
              >
                <div className="blurb-image">
                  <img height={70} width={70} alt="" src="" id={"images-x-2"} />
                  <h6 className="title" id="best-4-title">
                    <span id="title-question-3">Money Saving</span>
                  </h6>
                  <p className="exeption" id="best-4-content">
                    <span id="content-quesntion-3">
                      Our products cost less than their analogs by other
                      companies.
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="col-sm-6 col-md-4 wow fadeInLeft"
                data-wow-delay="0.1s"
              >
                <div className="blurb-image">
                  <img height={70} width={70} alt="" src="" id={"images-x-3"} />
                  <h6 className="title" id="best-5-title">
                    <span id="title-question-4"> Efficient Support</span>
                  </h6>
                  <p className="exeption" id="best-5-content">
                    <span id="content-question-4">
                      Softlabs offers extensive support to its customers all
                      over the world.
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="col-sm-6 col-md-4 wow fadeInLeft"
                data-wow-delay="0.2s"
              >
                <div className="blurb-image">
                  <img height={70} width={70} alt="" src="" id={"images-x-4"} />
                  <h6 className="title" id="best-6-title">
                    <span id="title-question-5">Innovative Technologies</span>
                  </h6>
                  <p className="exeption" id="best-6-content">
                    <span id="content-question-5">
                      Our developers use the latest technologies to deliver the
                      best apps.
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="col-sm-6 col-md-4 wow fadeInLeft"
                data-wow-delay="0.3s"
              >
                <div className="blurb-image">
                  <img height={70} width={70} alt="" src="" id={"images-x-5"} />
                  <h6 className="title" id="best-7-title">
                    <span id="title-question-6">Great Usability</span>
                  </h6>
                  <p className="exeption" id="best-7-content">
                    <span id="content-question-6">
                      Improved usability and UX are distinctive features of our
                      products.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* A Few Words About Our Bank*/}
        <section className="section section-lg bg-gray-100" id="about">
          <div className="container">
            <div className="block-lg text-center">
              <h2 id="words-1-title">
                <span id="few-words">A Few Word- About Us</span>
              </h2>
              <p id="words-1-content">
                <span id="few-words-content"></span>
              </p>
            </div>
            <div className="row row-20 justify-content-center justify-content-lg-between">
              <div className="col-md-10 col-lg-6 col-xl-7 wow fadeIn">
                <img
                  id="about-laptop-imagez"
                  src="images/index-1-657x400.png"
                  alt="photo"
                  width={657}
                  height={400}
                />
              </div>
              <div className="col-md-10 col-lg-6 col-xl-5">
                <div className="text-block-2">
                  <p id="words-2-content">
                    <span id="explanation-about-softlabs">
                      Softlabs offers software development solutions to business
                      owners as well as indvidual clients. Being fully equipped
                      with the latest technologies, we deliver futuristic
                      software solutions to clients globally. We employ a
                      skilled team of UI designers and app developers who are
                      totally focused on delivering high-quality software
                      solutions, which enable our customers to achieve their
                      critical IT objectives.
                    </span>
                  </p>

                  <a className="button button-lg button-gradient" href="#">
                    <span>More Details</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Financial Statistics*/}
        <section className="section section-lg bg-primary-dark">
          <div className="container">
            <h2 className="text-center">
              <span id="stats-1-title">Statistics</span>
            </h2>
            <div className="row row-20 justify-content-center justify-content-lg-between">
              <div className="col-md-12 col-lg-4 wow fadeIn">
                <blockquote className="quote quote-default">
                  <div className="quote-icon mdi mdi-format-quote" />
                  <div className="quote-body">
                    <q className="heading-6" id="stats-1-content">
                      <span id="aim-softlabs">
                        At Softlabs, we aim to provide top quality software
                        development services to a greater number of individual
                        and corporate customers than any other company in the
                        USA or abroad. Our apps help our clients grow
                        professionally and personally.
                      </span>
                    </q>
                  </div>
                  <div className="quote-meta">
                    <div className="author">
                      <cite id="stats-2-title">Samuel Chapman</cite>
                    </div>
                    <div className="position" id="stats-2-content">
                      CEO &amp;
                      <span id="softlabs-founder">Founder of Softlabs</span>
                    </div>
                  </div>
                </blockquote>
              </div>
              <div className="col-md-8 col-lg-5 col-xxl-4 wow fadeIn">
                <img alt="" src="./images/stats.jpg" />

                <p id="stats-3-content">
                  <span id="statistics-content">
                    With the development of online and mobile apps, our number
                    of clients has increased significantly
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Our Team*/}
        <section className="section section-lg" id="team">
          <div className="container text-center">
            <h2 id="teams-1-title">
              <span id="team-title">Our Team</span>
            </h2>
            {/* Owl Carousel*/}
            <div className="flex">
              {[...Array(3)].map((e, i) => (
                <div
                  key={i}
                  className="text-left"
                  data-items={1}
                  data-sm-items={2}
                  data-lg-items={3}
                  data-xl-items={4}
                  data-dots="true"
                  data-nav="false"
                  data-stage-padding={15}
                  data-loop="false"
                  data-margin={30}
                  data-mouse-drag="false"
                >
                  <div className="thumbnail-1">
                    <div className="media-wrap">
                      <img
                        src="images/team-1-270x270.jpg"
                        alt="photo"
                        width={270}
                        height={270}
                      />
                    </div>
                    <div className="title">
                      <a href="#">
                        <span id="title-team1">Samuel Chapman</span>
                      </a>
                    </div>
                    <div className="position">CEO &amp; Founder</div>
                    <p className="exeption">
                      <span id="content-team1">
                        Samuel is an IT leader running multiple-enterprises for
                        over 10 years. Seeing the bigger picture is his everyday
                        CEO routine.
                      </span>
                    </p>
                    <div className="group group-middle social-items">
                      <a
                        className="icon icon-md icon-gray-400 novi-icon mdi mdi-facebook"
                        href="#"
                      />
                      <a
                        className="icon icon-md icon-gray-400 novi-icon mdi mdi-twitter"
                        href="#"
                      />
                      <a
                        className="icon icon-md icon-gray-400 novi-icon mdi mdi-instagram"
                        href="#"
                      />
                      <a
                        className="icon icon-md icon-gray-400 novi-icon mdi mdi-facebook-messenger"
                        href="#"
                      />
                      <a
                        className="icon icon-md icon-gray-400 novi-icon mdi mdi-linkedin"
                        href="#"
                      />
                      <a
                        className="icon icon-md icon-gray-400 novi-icon mdi mdi-snapchat"
                        href="#"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Testimonials*/}
        <section className="section section-lg bg-gray-100" id="testimonials">
          <div className="container text-center">
            <h2 id="testimonial-1-title">Testimonials</h2>
            {/* Owl Carousel*/}
            <div
              className="text-left"
              data-items={1}
              data-md-items={2}
              data-dots="true"
              data-nav="false"
              data-stage-padding={0}
              data-loop="true"
              data-margin={30}
              data-mouse-drag="false"
              data-autoplay="true"
            >
              <blockquote className="quote quote-boxed">
                <div className="quote-meta">
                  <ul className="list-icons">
                    <li>
                      <div className="icon mdi mdi-star" />
                    </li>
                    <li>
                      <div className="icon mdi mdi-star" />
                    </li>
                    <li>
                      <div className="icon mdi mdi-star" />
                    </li>
                    <li>
                      <div className="icon mdi mdi-star" />
                    </li>
                    <li>
                      <div className="icon mdi mdi-star-half" />
                    </li>
                  </ul>
                  <div className="time">
                    <span id="time">2 days ago</span>
                  </div>
                </div>
                <q id="testimonial-1-content">
                  <span id="content-testimoni">
                    Softlabs is an innovative and professional company that has
                    provided us with valuable software development services. We
                    are very happy with our decision to cooperate with them.
                  </span>
                </q>
                <div className="quote-author">
                  <div className="author-media">
                    <img
                      src="images/user-1-64x64.jpg"
                      alt="photo"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="author-body">
                    <div className="author">
                      <cite>Marie Hanson</cite>
                    </div>
                    <div className="position">Regular Client</div>
                  </div>
                </div>
              </blockquote>
            </div>
          </div>
        </section>
        {/* How to Order a New Card*/}
        <section className="section section-lg section-decorate section-decorate-1">
          <div className="container text-center">
            <h2>Our Values</h2>
            <div className="row row-40 justify-content-center number-counter">
              <div className="col-sm-6 col-lg-3 wow fadeInLeft">
                <div className="blurb-icon-fill">
                  <div className="icon mercury-icon-user">
                    <span className="index-counter" />
                  </div>
                  <h5 className="title">
                    <span id="values-title1">Customer Focus</span>
                  </h5>
                  <p className="exeption">
                    <span id="values-content1">
                      Customers are our #1 priority and we focus on what they
                      need in every project we work on.
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="col-sm-6 col-lg-3 wow fadeInLeft"
                data-wow-delay="0.1s"
              >
                <div className="blurb-icon-fill">
                  <div className="icon mercury-icon-gear">
                    <span className="index-counter" />
                  </div>
                  <h5 className="title">
                    <span id="values-title2">Employee Empowerment</span>
                  </h5>
                  <p className="exeption">
                    <span id="values-content">
                      We empower our employees with necessary tools and
                      resources to develop the best apps.
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="col-sm-6 col-lg-3 wow fadeInLeft"
                data-wow-delay="0.2s"
              >
                <div className="blurb-icon-fill">
                  <div className="icon mercury-icon-target-2">
                    <span className="index-counter" />
                  </div>
                  <h5 className="title">
                    <span id="values-title3">Open &amp; Honest</span>
                  </h5>
                  <p className="exeption">
                    <span id="values-content3">
                      Softlabs is an open and highly honest team of developers
                      who know what our clients need.
                    </span>
                  </p>
                </div>
              </div>
              <div
                className="col-sm-6 col-lg-3 wow fadeInLeft"
                data-wow-delay="0.3s"
              >
                <div className="blurb-icon-fill">
                  <div className="icon mercury-icon-lightbulb-gears">
                    <span className="index-counter" />
                  </div>
                  <h5 className="title">
                    <span id="values-title4">Innovative Ideas</span>
                  </h5>
                  <p className="exeption">
                    <span id="values-content4">
                      Our products are based on innovative and creative ideas
                      delivered by our team.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Call to action*/}
        <section className="section section-xs bg-primary">
          <div className="container">
            <div className="box-cta">
              <div className="box-cta-inner">
                <h3>
                  <span id="configurable-products">
                    Highly Configurable Products
                  </span>
                </h3>
              </div>
              <div className="box-cta-inner">
                <a className="button button-lg button-primary" href="#">
                  <span id="learn-more-about-configurable-products">
                    Learn more
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
        {/* Gallery*/}
        <section className="section section-lg bg-gray-100" id="gallery">
          <div className="container text-center">
            <h2>
              <span id="image-content">Gallery</span>
            </h2>
            <div className="row">
              {/* Isotope Content*/}
              <div className="col-lg-12 text-left">
                <div
                  className="isotope"
                  data-isotope-layout="fitRows"
                  data-isotope-group="gallery"
                  data-lightgallery="group"
                >
                  <div className="row">
                    <div
                      className="col-sm-6 col-lg-4 isotope-item"
                      data-filter="*"
                    >
                      <a
                        className="gallery-item"
                        data-lightgallery="item"
                        href="images/gallery-original-1-1200x600.jpg"
                      >
                        <img
                          id="mobile-apps"
                          src="images/grid-gallery-1-370x248.jpg"
                          alt="photo"
                          width={370}
                          height={248}
                        />
                        <div className="gallery-item-content">
                          <div className="heading-5 title">Mobile Apps</div>
                          <div className="exeption">
                            <span id="content-image-1">
                              Softlabs offers its clients high-quality software
                              development services
                            </span>
                            .
                          </div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-sm-6 col-lg-4 isotope-item"
                      data-filter="Category 3"
                    >
                      <a
                        className="gallery-item"
                        data-lightgallery="item"
                        href="images/gallery-original-2-1200x600.jpg"
                      >
                        <img
                          id="io-apps"
                          src="images/grid-gallery-2-370x248.jpg"
                          alt="photo"
                          width={370}
                          height={248}
                        />
                        <div className="gallery-item-content">
                          <div className="heading-5 title">iOS Apps</div>
                          <div className="exeption">
                            <span id="content-image-2">
                              Softlabs offers its clients high-quality software
                              development services.
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-sm-6 col-lg-4 isotope-item"
                      data-filter="Category 3"
                    >
                      <a
                        className="gallery-item"
                        data-lightgallery="item"
                        href="images/gallery-original-3-1200x600.jpg"
                      >
                        <img
                          id="custom-software"
                          src="images/grid-gallery-3-370x248.jpg"
                          alt="photo"
                          width={370}
                          height={248}
                        />
                        <div className="gallery-item-content">
                          <div className="heading-5 title">Custom Software</div>
                          <div className="exeption">
                            <span id="content-image-3">
                              Softlabs offers its clients high-quality software
                              development services.
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-sm-6 col-lg-4 isotope-item"
                      data-filter="Category 3"
                    >
                      <a
                        className="gallery-item"
                        data-lightgallery="item"
                        href="images/gallery-original-4-1200x600.jpg"
                      >
                        <img
                          id="android-labs"
                          src="images/grid-gallery-4-370x248.jpg"
                          alt="photo"
                          width={370}
                          height={248}
                        />
                        <div className="gallery-item-content">
                          <div className="heading-5 title">Android Apps</div>
                          <div className="exeption">
                            <span id="content-image-4">
                              Softlabs offers its clients high-quality software
                              development services.
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-sm-6 col-lg-4 isotope-item"
                      data-filter="Category 2"
                    >
                      <a
                        className="gallery-item"
                        data-lightgallery="item"
                        href="images/gallery-original-5-1200x600.jpg"
                      >
                        <img
                          id="mac-apps"
                          src="images/grid-gallery-5-370x248.jpg"
                          alt="photo"
                          width={370}
                          height={248}
                        />
                        <div className="gallery-item-content">
                          <div className="heading-5 title">Mac Apps</div>
                          <div className="exeption">
                            <span id="content-image-5">
                              Softlabs offers its clients high-quality software
                              development services.
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-sm-6 col-lg-4 isotope-item"
                      data-filter="Category 2"
                    >
                      <a
                        className="gallery-item"
                        data-lightgallery="item"
                        href="images/gallery-original-6-1200x600.jpg"
                      >
                        <img
                          id="sofware-updates"
                          src="images/grid-gallery-6-370x248.jpg"
                          alt="photo"
                          width={370}
                          height={248}
                        />
                        <div className="gallery-item-content">
                          <div className="heading-5 title">
                            Software Updates
                          </div>
                          <div className="exeption">
                            <span id="content-image-6">
                              Softlabs offers its clients high-quality software
                              development services.
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-sm-6 col-lg-4 isotope-item"
                      data-filter="Category 1"
                    >
                      <a
                        className="gallery-item"
                        data-lightgallery="item"
                        href="images/gallery-original-7-1200x600.jpg"
                      >
                        <img
                          id="windows-application"
                          src="images/grid-gallery-7-370x248.jpg"
                          alt="photo"
                          width={370}
                          height={248}
                        />
                        <div className="gallery-item-content">
                          <div className="heading-5 title">
                            Windows Applications
                          </div>
                          <div className="exeption">
                            <span id="content-image-7">
                              Softlabs offers its clients high-quality software
                              development services.
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-sm-6 col-lg-4 isotope-item"
                      data-filter="Category 1"
                    >
                      <a
                        className="gallery-item"
                        data-lightgallery="item"
                        href="images/gallery-original-8-1200x600.jpg"
                      >
                        <img
                          id="outsourced-developmet"
                          src="images/grid-gallery-8-370x248.jpg"
                          alt="photo"
                          width={370}
                          height={248}
                        />
                        <div className="gallery-item-content">
                          <div className="heading-5 title">
                            Outsourced Development
                          </div>
                          <div className="exeption">
                            <span id="content-image-8">
                              Softlabs offers its clients high-quality software
                              development services.
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="col-sm-6 col-lg-4 isotope-item"
                      data-filter="Category 1"
                    >
                      <a
                        className="gallery-item"
                        data-lightgallery="item"
                        href="images/gallery-original-9-1200x600.jpg"
                      >
                        <img
                          id="ui-design-and-development"
                          src="images/grid-gallery-9-370x248.jpg"
                          alt="photo"
                          width={370}
                          height={248}
                        />
                        <div className="gallery-item-content">
                          <div className="heading-5 title">
                            UI Design &amp; Development
                          </div>
                          <div className="exeption">
                            <span id="content-image-9">
                              Softlabs offers its clients high-quality software
                              development services.
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Frequently Asked Questions*/}
        <section className="section section-lg">
          <div className="container text-center">
            <h2>
              <span id="asked-questions">Frequently Asked Questions</span>
            </h2>
            <div className="row row-flex row-40 number-counter text-left">
              <div className="col-sm-12 col-lg-4 wow fadeIn">
                <div className="text-block-lined">
                  <h5 className="title">
                    <span id="question-content-1">
                      Do you provide any scripts with your templates?
                    </span>
                  </h5>
                  <p>
                    <span id="answer-content-1">
                      Our templates do not include any additional scripts.
                      Newsletter subscriptions, search fields, forums, image
                      galleries (in HTML versions of Flash products) are
                      inactive. Basic scripts can be easily added at
                      www.zemez.io If you are not sure that the element you’re
                      interested in is active please contact our Support.
                    </span>
                  </p>
                  <h5 className="title">
                    <span id="question-content-2">
                      In what formats are your templates available?
                    </span>
                  </h5>
                  <p>
                    <span id="answer-content-2">
                      Website templates are available in Photoshop and HTML
                      formats. Fonts are included with the Photoshop file.
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-lg-4 wow fadeIn">
                <div className="text-block-lined">
                  <h5 className="title">
                    <span id="question-content-3">
                      What payment methods can I use to pay for my order?
                    </span>
                  </h5>
                  <p>
                    <span id="answer-content-3">
                      We accept Visa, MasterCard, and American Express credit
                      and debit cards for your convenience. Some other payment
                      methods are also available.
                    </span>
                  </p>
                  <h5 className="title">
                    <span id="question-content-4">
                      What are the advantages of purchasing a website template?
                    </span>
                  </h5>
                  <p>
                    <span id="answer-content-4">
                      The major advantage is price: You get a high quality
                      design for just $20-$70. You don’t have to hire a web
                      designer or web design studio. Second advantage is time
                      frame: It usually takes 5-15 days for a good designer to
                      produce a web page of such quality regardless of its
                      purpose.
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-sm-12 col-lg-4 wow fadeIn">
                <div className="text-block-lined">
                  <h5 className="title">
                    <span id="question-content-5">
                      What am I allowed to do with the templates?
                    </span>
                  </h5>
                  <p>
                    <span id="answer-content-5">
                      You may build a website using the template in any way you
                      like. You may not resell or redistribute templates (like
                      we do); claim intellectual or exclusive ownership to any
                      of our products.
                    </span>
                  </p>
                  <h5 className="title">
                    <span id="question-content-6">
                      What do I receive when I order a template from Zemez?
                    </span>
                  </h5>
                  <p>
                    <span id="answer-content-6">
                      After you complete the payment via our secure form you
                      will receive the instructions for downloading the product.
                      The source files in the download package can vary based on
                      the type of the product you have purchased.
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="button-wrap-lg">
              <a className="button button-lg button-gradient" href="#">
                <span>View All Questions</span>
              </a>
            </div>
          </div>
        </section>
        {/* Latest Blog Posts*/}
        <section className="section section-lg bg-gray-100">
          <div className="container text-center">
            <h2>
              <span id="blog-posts">Latest Blog Posts</span>
            </h2>
            <div className="row row-flex row-40 justify-content-center number-counter text-left wow fadeInUp">
              <div className="col-sm-6 col-lg-3">
                <article className="post-classic-2">
                  <a className="media-wrapper" href="#">
                    <img
                      id="news-image-1"
                      src="images/masonry-blog-1-270x176.jpg"
                      alt="photo"
                      width={270}
                      height={176}
                    />
                  </a>
                  <div className="post-meta-main">
                    <div className="post-meta-item">
                      <ul className="list-tags">
                        <li>
                          <a className="tag" href="#">
                            <span id="news-1">News</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="post-meta-item">
                      <div className="post-author">
                        <span>by</span>
                        <a href="#">
                          <span id="publisher">Martha Ryan</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <h6 className="post-title">
                    <a href="#">
                      <span id="news-title-1">
                        Undertaking Custom Software Development
                      </span>
                    </a>
                  </h6>
                  <p className="post-exeption">
                    <span id="news-content-1">
                      When your business needs custom software development, it
                      may be tempting to turn the project over to in-house IT
                      but you may want to...
                    </span>
                  </p>
                  <div className="post-date">2 days ago</div>
                </article>
              </div>
              <div className="col-sm-6 col-lg-3">
                <article className="post-classic-2">
                  <a className="media-wrapper" href="#">
                    <img
                      id="news-image-2"
                      src="images/masonry-blog-2-270x176.jpg"
                      alt="photo"
                      width={270}
                      height={176}
                    />
                  </a>
                  <div className="post-meta-main">
                    <div className="post-meta-item">
                      <ul className="list-tags">
                        <li>
                          <a className="tag" href="#">
                            <span id="news-2"> News</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="post-meta-item">
                      <div className="post-author">
                        <span>by</span>
                        <a href="#">
                          <span id="publisher">Lawrence Kelly</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <h6 className="post-title">
                    <a href="#">
                      <span id="news-title-2">
                        Can Mobile Software Give Your Business an Advantage Your
                        Competitors Lack?
                      </span>
                    </a>
                  </h6>
                  <p className="post-exeption">
                    <span id="news-content-2">
                      If you havent employed the benefits of mobile business
                      intelligence, you are tying the hands of your managers and
                      business users. No matter how...
                    </span>
                  </p>
                  <div className="post-date">
                    <span id="time">2 days ago</span>
                  </div>
                </article>
              </div>
              <div className="col-sm-6 col-lg-3">
                <article className="post-classic-2">
                  <a className="media-wrapper" href="#">
                    <img
                      id="news-image-3"
                      src="images/masonry-blog-3-270x176.jpg"
                      alt="photo"
                      width={270}
                      height={176}
                    />
                  </a>
                  <div className="post-meta-main">
                    <div className="post-meta-item">
                      <ul className="list-tags">
                        <li>
                          <a className="tag" href="#">
                            <span id="news-3">News</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="post-meta-item">
                      <div className="post-author">
                        <span>by</span>
                        <a href="#">
                          <span id="publisher"> Theresa Simpson </span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <h6 className="post-title">
                    <a href="#">
                      <span id="news-title-3">
                        Choosing a Software Development Company
                      </span>
                    </a>
                  </h6>
                  <p className="post-exeption">
                    <span id="news-content-3">
                      Choosing the right software development company for your
                      product is like hiring a crew to build your new house.
                      Triple check the contractor...
                    </span>
                  </p>
                  <div className="post-date">
                    <span id="time">2 days ago</span>
                  </div>
                </article>
              </div>
              <div className="col-sm-6 col-lg-3">
                <article className="post-classic-2">
                  <a className="media-wrapper" href="#">
                    <img
                      id="image-4"
                      src="images/masonry-blog-4-270x176.jpg"
                      alt="photo"
                      width={270}
                      height={176}
                    />
                  </a>
                  <div className="post-meta-main">
                    <div className="post-meta-item">
                      <ul className="list-tags">
                        <li>
                          <a className="tag" href="#">
                            <span id="news-4">News</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="post-meta-item">
                      <div className="post-author">
                        <span>by</span>
                        <a href="#">
                          <span id="publisher">Lawrence Kelly</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <h6 className="post-title">
                    <a href="#">
                      <span id="news-title-4">
                        What Skills Should You Test While Hiring a React Native
                        Developer?
                      </span>
                    </a>
                  </h6>
                  <p className="post-exeption">
                    <span id="news-content-4">
                      React Native is obviously a great mobile app development
                      framework. It’s good if you have chosen React Native for
                      building mobile apps, but...
                    </span>
                  </p>
                  <div className="post-date">
                    <span id="time">2 days ago</span>
                  </div>
                </article>
              </div>
            </div>
            <div className="button-wrap-lg">
              <a className="button button-lg button-gradient" href="#">
                <span>View All Blog Posts</span>
              </a>
            </div>
          </div>
        </section>
        {/* Pricing*/}
        <section className="section section-lg">
          <div className="container text-center">
            <h2>
              <span id="price-tag">Pricing</span>
            </h2>
            <div className="row no-gutters justify-content-center">
              <div className="col-md-4">
                <div className="price-box-1 price-box-decor-top">
                  <div className="title">
                    <span id="silver-price">Silver</span>
                  </div>
                  <p className="exeption">
                    <span id="silver-price-explanation">
                      This option is perfect if you need a simple app for your
                      corporate or personal needs and don’t want to overpay for
                      its development.
                    </span>
                  </p>
                  <div className="heading-3 price">
                    <span id="cost-silver-price">$100.00/mo</span>
                  </div>
                  <a className="button button-lg button-gradient" href="#">
                    <span>Buy Now</span>
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="price-box-1 price-box-1-primary">
                  <div className="title">
                    <span id="gold-price">Gold</span>
                  </div>
                  <p className="exeption">
                    <span id="gold-price-explanation">
                      This offer provides you with extended support for your
                      future application as well as fair pricing and more useful
                      features for your app.
                    </span>
                  </p>
                  <div className="heading-3 price">
                    <span id="cost-gold-price">$149.00/mo</span>
                  </div>
                  <a className="button button-lg button-gradient" href="#">
                    <span>Buy Now</span>
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="price-box-1 price-box-decor-bottom">
                  <div className="title">
                    <span id="diamond-price">Diamond</span>
                  </div>
                  <p className="exeption">
                    <span id="diamond-price-explanation">
                      Choose this plan if you need a powerful application for
                      your business with lots of features, extended support, and
                      full integration into your workflow.
                    </span>
                  </p>
                  <div className="heading-3-price">
                    <span id="cost-diamond-price">$199.00/mo</span>
                  </div>
                  <a className="button button-lg button-gradient" href="#">
                    <span>Buy Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <hr />
          </div>
        </section>
        <section className="section section-lg bg-default" id="contacts">
          <div className="container">
            <div className="row row-50 justify-content-between">
              <div className="col-md-6 col-lg-4 col-xl-3">
                <div>
                  <ul className="contact-box">
                    <li>
                      <div className="unit unit-horizontal unit-spacing-xxs">
                        <div className="unit-left">
                          <span className="icon mdi mdi-map-marker" />
                        </div>
                        <div className="unit-body">
                          <a className="hover-text" href="#">
                            <span id="address1"> 2130 Fulton Street, </span>
                            <br className="veil reveal-lg-inline" />
                            <span id="address2">
                              San Diego, CA 94117-1080 USA
                            </span>
                          </a>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="unit unit-horizontal unit-spacing-xxs">
                        <div className="unit-left">
                          <span className="icon mdi mdi-phone" />
                        </div>
                        <div className="unit-body">
                          <ul className="list-phones">
                            <li>
                              <a className="hover-text" href="tel:#">
                                <span id="telephone-number1">
                                  1-800-1234-567
                                </span>
                              </a>
                            </li>
                            <li>
                              <a className="hover-text" href="tel:#">
                                <span id="telephone-number2">
                                  1-800-1234-567
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="unit unit-horizontal unit-spacing-xxs">
                        <div className="unit-left">
                          <span className="icon mdi mdi-email-outline" />
                        </div>
                        <div className="unit-body">
                          <a className="hover-text" href="mailto:#">
                            <span id="email-contact">info@demolink.org</span>
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="group group-middle social-items">
                  <a
                    className="icon icon-md icon-gray-400 novi-icon mdi mdi-facebook"
                    href="#"
                  />
                  <a
                    className="icon icon-md icon-gray-400 novi-icon mdi mdi-twitter"
                    href="#"
                  />
                  <a
                    className="icon icon-md icon-gray-400 novi-icon mdi mdi-instagram"
                    href="#"
                  />
                  <a
                    className="icon icon-md icon-gray-400 novi-icon mdi mdi-facebook-messenger"
                    href="#"
                  />
                  <a
                    className="icon icon-md icon-gray-400 novi-icon mdi mdi-linkedin"
                    href="#"
                  />
                  <a
                    className="icon icon-md icon-gray-400 novi-icon mdi mdi-snapchat"
                    href="#"
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <h4>
                  <span id="contact">Get in Touch</span>
                </h4>
                {/* RD Mailform*/}
                <form
                  className="rd-form rd-mailform"
                  data-form-output="form-output-global"
                  data-form-type="contact"
                  method="post"
                  // action="bat/rd-mailform.php"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="form-wrap">
                    <input
                      className="form-input"
                      type="text"
                      name="name"
                      data-constraints="@Required"
                    />
                    <label className="form-label" htmlFor="contact-name">
                      <span id="name-contact">Name</span>
                    </label>
                  </div>
                  <div className="form-wrap">
                    <input
                      className="form-input"
                      type="email"
                      name="email"
                      data-constraints="@Email @Required"
                    />
                    <label className="form-label" htmlFor="contact-email">
                      E-mail
                    </label>
                  </div>
                  <div className="form-wrap">
                    <label className="form-label" htmlFor="contact-message">
                      <span id="message">Message</span>
                    </label>
                    <textarea
                      className="form-input"
                      name="message"
                      data-constraints="@Required"
                      defaultValue={""}
                    />
                  </div>
                  <button className="button button-gradient" type="submit">
                    <span>Send</span>
                  </button>
                </form>
              </div>
              <div className="col-md-12 col-lg-3">
                <div
                  className="google-map-container"
                  data-center="9870 St Vincent Place, Glasgow, DC 45 Fr 45."
                  data-zoom={5}
                  data-icon="images/gmap_marker.png"
                  data-icon-active="images/gmap_marker_active.png"
                  data-styles='[{"featureType": "all","elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#333333"},{"lightness": 40}]},{"featureType": "all","elementType": "labels.text.stroke","stylers": [{"visibility": "on"},{"color": "#ffffff"},{"lightness": 16}]},{"featureType": "all","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#fefefe"},{"lightness": 20}]},{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#fefefe"},{"lightness": 17},{"weight": 1.2}]},{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 20}]},{"featureType": "landscape","elementType": "geometry.fill","stylers": [{"color": "#d5d5d5"}]},{"featureType": "landscape.man_made","elementType": "geometry.fill","stylers": [{"color": "#7574c0"},{"saturation": "-37"},{"lightness": "75"}]},{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#f5f5f5"},{"lightness": 21}]},{"featureType": "poi.business","elementType": "geometry.fill","stylers": [{"color": "#7574c0"},{"saturation": "-2"},{"lightness": "53"}]},{"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#dedede"},{"lightness": 21}]},{"featureType": "poi.park","elementType": "geometry.fill","stylers": [{"color": "#7574c0"},{"lightness": "69"}]},{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#7574c0"},{"lightness": "25"}]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#ffffff"},{"lightness": 29},{"weight": 0.2}]},{"featureType": "road.highway","elementType": "labels.text.fill","stylers": [{"lightness": "38"},{"color": "#000000"}]},{"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 18}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"color": "#ffffff"},{"lightness": 16}]},{"featureType": "transit","elementType": "geometry","stylers": [{"color": "#f2f2f2"},{"lightness": 19}]},{"featureType": "water","elementType": "geometry","stylers": [{"color": "#e9e9e9"},{"lightness": 17}]}]'
                >
                  <div className="google-map" />
                  <ul className="google-map-markers">
                    <li
                      data-location="9870 St Vincent Place, Glasgow, DC 45 Fr 45."
                      data-description="9870 St Vincent Place, Glasgow"
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Page Footer*/}
        <footer className="section footer-2">
          <div className="container">
            <div className="row row-40">
              <div className="col-md-6 col-lg-3">
                <a className="footer-logo" href="index.html">
                  <img
                    src="images/logo-white-199x42.png"
                    alt="photo"
                    width={199}
                    height={42}
                  />
                </a>
                <p>
                  <span id="about-softlabs">
                    Softlabs is an industry-leading software development company
                    building digital products that last. By being reasonable
                    product craftsmen, were able to avoid surprises and focus on
                    the quality of the software we deliver.
                  </span>
                </p>
              </div>
              <div className="col-md-6 col-lg-3">
                <h5 className="title">
                  <span id="contact-info">Contact Information</span>
                </h5>
                <ul className="contact-box">
                  <li>
                    <div className="unit unit-horizontal unit-spacing-xxs">
                      <div className="unit-left">
                        <span className="icon mdi mdi-map-marker" />
                      </div>
                      <div className="unit-body">
                        <a href="#">
                          <span id="softlabs-address">2130 Fulton Street,</span>
                          <br className="veil reveal-lg-inline" />
                          <span id="softlabs-address">
                            San Diego, CA 94117-1080 USA
                          </span>
                        </a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="unit unit-horizontal unit-spacing-xxs">
                      <div className="unit-left">
                        <span className="icon mdi mdi-phone" />
                      </div>
                      <div className="unit-body">
                        <ul className="list-phones">
                          <li>
                            <a href="tel:#">
                              <span id="softlabs-numbers1">1-800-1234-567</span>
                            </a>
                          </li>
                          <li>
                            <a href="tel:#">
                              <span id="softlabs-number2">1-800-1234-567</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="unit unit-horizontal unit-spacing-xxs">
                      <div className="unit-left">
                        <span className="icon mdi mdi-email-outline" />
                      </div>
                      <div className="unit-body">
                        <a href="mailto:#">
                          <span id="softlabs-email">info@demolink.org</span>
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div className="group-md group-middle social-items">
                  <a
                    className="icon icon-md novi-icon mdi mdi-facebook"
                    href="#"
                  />
                  <a
                    className="icon icon-md novi-icon mdi mdi-twitter"
                    href="#"
                  />
                  <a
                    className="icon icon-md novi-icon mdi mdi-instagram"
                    href="#"
                  />
                  <a
                    className="icon icon-md novi-icon mdi mdi-facebook-messenger"
                    href="#"
                  />
                  <a
                    className="icon icon-md novi-icon mdi mdi-linkedin"
                    href="#"
                  />
                  <a
                    className="icon icon-md novi-icon mdi mdi-snapchat"
                    href="#"
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <h5 className="title">
                  <span id="galerry">Gallery</span>
                </h5>
                <ul
                  className="instafeed instagram-gallery"
                  data-lightgallery="group"
                >
                  <li>
                    <a
                      className="instagram-item"
                      data-lightgallery="item"
                      href="images/insta-gallery-1-original.jpg"
                    >
                      <img
                        id="img-1"
                        src="images/insta-gallery-1-72x72.jpg"
                        alt="photo"
                        width={72}
                        height={72}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      className="instagram-item"
                      data-lightgallery="item"
                      href="images/insta-gallery-2-original.jpg"
                    >
                      <img
                        id="img-2"
                        src="images/insta-gallery-2-72x72.jpg"
                        alt="photo"
                        width={72}
                        height={72}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      className="instagram-item"
                      data-lightgallery="item"
                      href="images/insta-gallery-3-original.jpg"
                    >
                      <img
                        id="img-3"
                        src="images/insta-gallery-3-72x72.jpg"
                        alt="photo"
                        width={72}
                        height={72}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      className="instagram-item"
                      data-lightgallery="item"
                      href="images/insta-gallery-4-original.jpg"
                    >
                      <img
                        id="img-4"
                        src="images/insta-gallery-4-72x72.jpg"
                        alt="photo"
                        width={72}
                        height={72}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      className="instagram-item"
                      data-lightgallery="item"
                      href="images/insta-gallery-5-original.jpg"
                    >
                      <img
                        id="img-5"
                        src="images/insta-gallery-5-72x72.jpg"
                        alt="photo"
                        width={72}
                        height={72}
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      className="instagram-item"
                      data-lightgallery="item"
                      href="images/insta-gallery-6-original.jpg"
                    >
                      <img
                        id="img-6"
                        src="images/insta-gallery-6-72x72.jpg"
                        alt="photo"
                        width={72}
                        height={72}
                      />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-md-6 col-lg-3">
                <h5 className="title">
                  <span id="newsletter">Newsletter</span>
                </h5>
                <p>
                  <span id="newsletter-explanation">
                    Keep up with our always upcoming news and updates.-enter
                    your e-mail and subscribe to our newsletter.
                  </span>
                </p>
                {/* RD Mailform*/}
                <form
                  className="rd-form form-sm rd-mailform"
                  data-form-output="form-output-global"
                  data-form-type="contact"
                  method="post"
                  action="bat/rd-mailform.php"
                  // action="bat/rd-mailform.php"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="form-wrap">
                    <input
                      className="form-input"
                      type="email"
                      name="email"
                      data-constraints="@Email @Required"
                    />
                    <label className="form-label" htmlFor="newsletter-email2">
                      <span id="email-enter">Enter your e-mail</span>
                    </label>
                  </div>
                  <button className="button button-gradient" type="submit">
                    <span>Subscribe</span>
                  </button>
                </form>
              </div>
            </div>
            {/* Rights*/}
            <p className="rights">
              <span>©&nbsp; </span>
              <span className="copyright-year" />
              <span>&nbsp;</span>
              <span>All rights reserved</span>
              <span>.&nbsp;</span>Design&nbsp;by&nbsp;
              <a href="https://zemez.io/">Zemez</a>
            </p>
          </div>
        </footer>
        {/* Modal*/}
        <div className="modal fade" id="modal" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header context-dark">
                <h4 className="modal-title">Call Back</h4>
                <button
                  className="close"
                  type="button"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body bg-default">
                <form
                  className="rd-form rd-mailform"
                  data-form-output="form-output-global"
                  data-form-type="contact"
                  method="post"
                  action="bat/rd-mailform.php"
                  // action="bat/rd-mailform.php"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="form-wrap">
                    <input
                      className="form-input"
                      type="text"
                      name="name"
                      data-constraints="@Required"
                    />
                    <label className="form-label" htmlFor="modal-name">
                      <span id="name-enter">Name</span>
                    </label>
                  </div>
                  <div className="form-wrap">
                    <input
                      className="form-input"
                      type="text"
                      name="phone"
                      data-constraints="@Required @PhoneNumber"
                    />
                    <label className="form-label" htmlFor="modal-phone">
                      <span id="phone-enter"> Phone</span>
                    </label>
                  </div>
                  <div className="button-block text-center">
                    <button
                      className="button button-gradient d-inline-block"
                      type="submit"
                    >
                      <span>Send</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// <Container
//       style={{
//         background:
//           "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('./images/swiper-bg.jpg')",
//       }}
//     >
//       <div className="flex gap-2 h-screen items-center justify-center">
//         <Swiper
//           className="section swiper-container swiper-slider swiper-slider-2"
//           loop
//           autoplay={{ delay: 5500 }}
//         >
//           <div className="swiper-wrapper text-center text-md-left">
//             <SwiperSlide className="swiper-slide context-dark">
//               <div className="swiper-slide-caption">
//                 <div className="flex flex-col gap-2 items-center text-center md:text-left md:items-start">
//                   <div>
//                     <h1 className="font-semibold text-xl md:text-4xl lg:text-8xl">
//                       Softlabs
//                       <br />
//                       Innovative Solutions
//                     </h1>
//                     <Button>Learn More</Button>
//                   </div>
//                 </div>
//               </div>
//             </SwiperSlide>
//           </div>
//           <div className="swiper-meta">
//             <ul className="links">
//               <li>
//                 <a className="icon icon-meta mdi mdi-facebook" href="#" />
//               </li>
//               <li>
//                 <a className="icon icon-meta mdi mdi-twitter" href="#" />
//               </li>
//               <li>
//                 <a className="icon icon-meta mdi mdi-instagram" href="#" />
//               </li>
//               <li>
//                 <a
//                   className="icon icon-meta mdi mdi-facebook-messenger"
//                   href="#"
//                 />
//               </li>
//               <li>
//                 <a className="icon icon-meta mdi mdi-linkedin" href="#" />
//               </li>
//               <li>
//                 <a className="icon icon-meta mdi mdi-snapchat" href="#" />
//               </li>
//             </ul>
//             <div className="contacts">
//               <div className="icon mdi mdi-cellphone-iphone" />
//               <div className="tel">
//                 <a href="tel:#">1-800-1234-567</a>
//               </div>
//               <div className="request">
//                 <a href="#modal" data-toggle="modal">
//                   Request a Call Back
//                 </a>
//               </div>
//             </div>
//             {/* Swiper Pagination*/}
//             <div className="swiper-pagination" />
//           </div>
//         </Swiper>
//         <img
//           src="images/swiper-img.png"
//           className="opacity-25 lg:opacity-100"
//         />
//       </div>
//     </Container>
//     <Container className="text-white" withoutPadding>
//       <div className="grid grid-cols-1 md:grid-cols-4">
//         <div>
//           <div className="blurb-boxed-2 h-full">
//             <div className="icon mdi mdi-responsive" />
//             <h6 className="pt-6 text-white">Mobile and Desktop Apps</h6>
//             <p className="text-white text-sm">
//               Our company delivers various types of mobile and desktop
//               software as well as custom solutions for businesses.
//             </p>
//           </div>
//         </div>
//         <div>
//           <div className="blurb-boxed-2 h-full blurb-boxed-dark">
//             <div className="icon mdi mdi-star-outline" />
//             <h6 className="pt-6 text-white">Corporate Solutions</h6>
//             <p className="text-white text-sm">
//               Need specific software for your company? Our team is ready to
//               design and develop it for you!
//             </p>
//           </div>
//         </div>
//         <div>
//           <div className="blurb-boxed-2 h-full blurb-boxed-darker">
//             <div className="icon mdi mdi-headset" />
//             <h6 className="pt-6 text-white">24/7 Support</h6>
//             <p className="text-white text-sm">
//               We also provide full 24/7 client support. In case you have a
//               problem with our apps, feel free to contact us anytime.
//             </p>
//           </div>
//         </div>
//         <div>
//           <div className="blurb-boxed-2 h-full blurb-boxed-darkest">
//             <p className="text-white text-sm">Reliable Apps Since 2005</p>
//             <h5 className="pt-6 text-white">
//               We Can Design an App of Any Complexity for Your Company
//             </h5>
//             <Button>Learn More</Button>
//           </div>
//         </div>
//       </div>
//     </Container>
//     <Container className="p-10">
//       <div className="flex flex-col gap-2 items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-4xl">Why Choose Us</h2>
//           <p>
//             Our clients have been choosing Softlabs for a number of reasons
//             including reliability, latest technologies, and constant updates
//             &amp; support. Read more about other advantages below.
//           </p>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-3">
//           {[...Array(6)].map((e, i) => (
//             <div className="wow fadeInLeft" key={i}>
//               <div className="blurb-image">
//                 <div className="icon mercury-icon-time" />
//                 <h6 className="title">Quick Results</h6>
//                 <p className="exeption">
//                   We work quickly and efficiently to provide the best results.
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Container>
//     <Container className="bg-gray-100 py-10">
//       <div className="container mx-auto">
//         <div className="block-lg text-center">
//           <h2 className="text-4xl">A Few Words About Us</h2>
//           <p>
//             Our company provides custom software development services to
//             individual clients, start-ups, medium businesses, and large
//            -enterprises. You can find out more about who we are and what we do
//             below.
//           </p>
//         </div>
//         <div className="">
//           <div className="flex justify-center">
//             <img src="images/index-1-657x400.png" width={657} height={400} />
//           </div>
//           <div>
//             <div>
//               <p>
//                 Softlabs offers software development solutions to business
//                 owners as well as indvidual clients. Being fully equipped with
//                 the latest technologies, we deliver futuristic software
//                 solutions to clients globally. We employ a skilled team of UI
//                 designers and app developers who are totally focused on
//                 delivering high-quality software solutions, which enable our
//                 customers to achieve their critical IT objectives.
//               </p>
//               <div className="progress-linear-wrap">
//                 {/* Linear progress bar*/}
//                 <article className="progress-linear">
//                   <div className="progress-header">
//                     <p>UI Design</p>
//                     <span className="progress-value">75</span>
//                   </div>
//                   <div className="progress-bar-linear-wrap">
//                     <div className="progress-bar-linear" />
//                   </div>
//                 </article>
//                 {/* Linear progress bar*/}
//                 <article className="progress-linear">
//                   <div className="progress-header">
//                     <p>Software Development</p>
//                     <span className="progress-value">50</span>
//                   </div>
//                   <div className="progress-bar-linear-wrap">
//                     <div className="progress-bar-linear" />
//                   </div>
//                 </article>
//               </div>
//               <Button>Learn More</Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Container>
//     <Container>
//       {/* <div className="container mx-auto">
//         <h2 className="text-4xl text-center">Stastics</h2>
//         <div className="grid grid-cols gap-2">
//           <div className=" wow fadeIn">
//             <blockquote className="">
//               <div className="quote-icon mdi mdi-format-quote" />
//               <div className="">
//                 <q className="text-lg">
//                   At Softlabs, we aim to provide top quality software
//                   development services to a greater number of individual and
//                   corporate customers than any other company in the USA or
//                   abroad. Our apps help our clients grow professionally and
//                   personally.
//                 </q>
//               </div>
//               <div>
//                 <div className="text-yellow-300">
//                   <cite>Samuel Chapman</cite>
//                 </div>
//                 <div className="italic text-gray-600">
//                   CEO &amp; Founder of Softlabs
//                 </div>
//               </div>
//             </blockquote>
//           </div>
//         </div>
//       </div> */}
//     </Container>
//     <Container>
//       <div className="container text-center mx-auto">
//         <h2 className="text-4xl text-center">Our Team</h2>
//         <Swiper
//           slidesPerView={4}
//           pagination={{
//             clickable: true,
//           }}
//           spaceBetween={20}
//         >
//           <Loader<User>
//             dontFetchmore
//             Component={(e) => (
//               <SwiperSlide>
//                 <UserCard {...e} />
//               </SwiperSlide>
//             )}
//             perPage={16}
//             query={gql`
//               query Query($first: Int!, $after: String) {
//                 parentCandidate(
//                   first: $first
//                   after: $after
//                   roles: TRAINER
//                 ) {
//                   pageInfo {
//                     hasNextPage
//                     hasPreviousPage
//                     startCursor
//                     endCursor
//                     total
//                     count
//                     currentPage
//                     lastPage
//                   }
//                   edges {
//                     node {
//                       id
//                       name
//                       username
//                       title
//                       roles
//                       description
//                       cover {
//                         id
//                         path
//                         name
//                       }
//                     }
//                   }
//                 }
//               }
//             `}
//             fields={"parentCandidate"}
//             key="nottest"
//           />
//         </Swiper>
//       </div>
//     </Container>
//     <Container className="p-10 bg-gray-100">
//       <div className="container mx-auto">
//         <h2 className="text-4xl text-center my-10">Our Team</h2>
//         {/* Owl Carousel*/}
//         <Swiper id="home" loop autoplay={{ delay: 5500 }}>
//           <TestimonialCard />
//         </Swiper>
//       </div>
//     </Container>
//     <Container className="p-10">
//       <div className="container  mx-auto text-center">
//         <h2 className="text-4xl text-center my-10">Our Values</h2>
//         <div className="grid grid-cols-2  lg:grid-cols-4">
//           <div className="wow fadeInLeft">
//             <div className="blurb-icon-fill">
//               <div className="icon mercury-icon-user"></div>
//               <h5 className="title">Customer Focus</h5>
//               <p className="exeption">
//                 Customers are our #1 priority and we focus on what they need
//                 in every project we work on.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Container>
//     <Container className="p-10 bg-gray-100">
//       <div className="container mx-auto text-center">
//         <h2 className="text-4xl text-center my-10">Video Kami</h2>
//         <Loader<Video>
//           Component={VideoCard}
//           fields="videos"
//           perPage={18}
//           query={gql`
//             query Query($first: Int!, $after: String, $category_id: ID) {
//               videos(
//                 first: $first
//                 after: $after
//                 category_id: $category_id
//               ) {
//                 edges {
//                   node {
//                     id
//                     name
//                     created_at
//                     updated_at
//                     metadata {
//                       duration_sec
//                       thumbnail {
//                         hqDefault
//                       }
//                     }
//                     user {
//                       id
//                       name
//                       username
//                       cover {
//                         id
//                         path
//                         mime
//                         name
//                       }
//                     }
//                   }
//                 }
//                 pageInfo {
//                   hasNextPage
//                   hasPreviousPage
//                   startCursor
//                   endCursor
//                   total
//                   count
//                   currentPage
//                   lastPage
//                 }
//               }
//             }
//           `}
//           dontFetchmore
//         />
//       </div>
//     </Container>
//     <Container className="p-10">
//       <div className="container mx-auto text-center">
//         <h2 className="text-4xl text-center my-10">FAQ</h2>
//         <div className="text-left grid grid-cols-1 md:grid-cols-3">
//           {[...Array(3)].map((e, i) => (
//             <div key={i} className="wow fadeIn">
//               <div className="border-r-2 border-gray-600 p-2 flex flex-col gap-2">
//                 <h5 className="text-lg">
//                   Do you provide any scripts with your templates?
//                 </h5>
//                 <p className="text-sm">
//                   Our templates do not include any additional scripts.
//                   Newsletter subscriptions, search fields, forums, image
//                   galleries (in HTML versions of Flash products) are inactive.
//                   Basic scripts can be easily added at www.zemez.io If you are
//                   not sure that the element you’re interested in is active
//                   please contact our Support.
//                 </p>
//                 <h5 className="text-lg">
//                   In what formats are your templates available?
//                 </h5>
//                 <p className="text-sm`">
//                   Website templates are available in Photoshop and HTML
//                   formats. Fonts are included with the Photoshop file.
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="button-wrap-lg">
//           <Button>Learn More</Button>
//         </div>
//       </div>
//     </Container>
//     <Container className="p-10 bg-gray-100">
//       <div className="container mx-auto text-center">
//         <h2 className="text-4xl text-center my-10">Latest Blog Posts</h2>
//         <div className="grid grid-cols-2 md:grid-cols-3 text-left wow fadeInUp gap-3">
//           {[...Array(6)].map((e, i) => (
//             <PostCard key={i} />
//           ))}
//         </div>
//         <div className="button-wrap-lg">
//           <Button>Learn More</Button>
//         </div>
//       </div>
//     </Container>
//     <Container className="p-10">
//       <div className="container mx-auto text-center">
//         <h2 className="text-4xl text-center my-10">Langganan</h2>
//         <div className="grid grid-cols-2 gap-2">
//           {[...Array(2)].map((e, i) => (
//             <PricingCard key={i} />
//           ))}
//         </div>
//       </div>
//     </Container>
//     <Footer />
