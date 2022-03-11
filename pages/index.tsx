import React, { CSSProperties, useEffect } from "react";

import withRouter, { WithRouterProps } from "next/dist/client/with-router";
import MainLayout from "../components/layout/MainLayout";
import SectionSwiperCoomponent from "../components/home/SectionSwiperComponent";
import SectionOfferCoomponent from "../components/home/SectionOfferComponent";
import SectionWhyChooseUsCoomponent from "../components/home/SectionWhyChooseUsComponent";
import SectionAboutUsCoomponet from "../components/home/SectionAboutUsComponent";
import SectionStatisticCoomponet from "../components/home/SectionStatisticComponent";
import SectionOurTeamComponent from "../components/home/SectionOurTeamComponent";
import SectionTestimonialsComponent from "../components/home/SectionTestimonialsComponent";
import SectionOurValueComponent from "../components/home/SectionOurValueComponent";
import SectionGaleryComponent from "../components/home/SectionGaleryComponent";
import SectionFrequentlyQuestionsComponent from "../components/home/SectionFrequentlyQuestionsComponent";
import SectionBlogsComponent from "../components/home/SectionBlogsComponent";
import SectionPricingComponent from "../components/home/SectionPricingComponent";
import { Page, Roles } from "../types/type";
import { gql, useMutation, useQuery } from "@apollo/client";
import { TextProps, ImageProps, ButtonProps } from "../types/pageEditor";
import TextDefaultProp from "../constant/TextDefaultProp";
import ImageDefaultProp from "../constant/ImageDefaultProp";
import ButtonDefaultProp from "../constant/ButtonDefaultProp";
import { useStore } from "../state-management/useStore";
import { useUserStore } from "../store/user";
import Preloader from "../components/layout/Preloader";

function Index({ router: { query, push } }: WithRouterProps) {

  const { user, setUser } = useUserStore();
  const { text, image, getSelected, editId, type, setTextByKey,  setImageByKey, setText, setImage, onEdit, setOnEdit, setButtonByKey, setButton, button } = useStore();

  useEffect(() => {
    if (query.editor) {
      setOnEdit(query.editor == "true" && user?.roles == Roles.Admin);
    }
  }, [query, setOnEdit, user?.roles]);
  
  const { data: { page } = {},
    refetch,
    loading,
  } = useQuery<{ page: Page }>(
    gql`
      query Query($id: ID!) {
        page(id: $id) {
          id
          name
          created_at
          updated_at
          route
          data
        }
      }
    `,
    {
      variables: { id: 1 },
      onCompleted({ page }) {
        try {
          if (page?.data) {
            const data: {
              text: Record<string, TextProps>;
              image: Record<string, ImageProps>;
              button: Record<string, ButtonProps>;
            } = JSON.parse(page.data);
            setText(data?.text ?? TextDefaultProp);
            setImage(data?.image ?? ImageDefaultProp);
            setButton(data?.button ?? ButtonDefaultProp);
          }
        } catch (error) {
          setText(TextDefaultProp);
          setImage(ImageDefaultProp);
          setButton(ButtonDefaultProp);
        }
      },
    }
  );

  return (
    <MainLayout showFooter={true} showHeader={true}>
      
      <Preloader loading={loading}></Preloader>

      <SectionSwiperCoomponent></SectionSwiperCoomponent>

      <SectionOfferCoomponent></SectionOfferCoomponent>

      <SectionWhyChooseUsCoomponent></SectionWhyChooseUsCoomponent>

      <SectionAboutUsCoomponet></SectionAboutUsCoomponet>

      <SectionStatisticCoomponet></SectionStatisticCoomponet>

      <SectionOurTeamComponent></SectionOurTeamComponent>

      <SectionTestimonialsComponent></SectionTestimonialsComponent>

      <SectionOurValueComponent></SectionOurValueComponent>

      <SectionGaleryComponent></SectionGaleryComponent>

      <SectionFrequentlyQuestionsComponent></SectionFrequentlyQuestionsComponent>

      <SectionBlogsComponent></SectionBlogsComponent>

      <SectionPricingComponent></SectionPricingComponent>

    </MainLayout>
  );
}

export default withRouter(Index);