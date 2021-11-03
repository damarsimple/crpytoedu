import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import { City, District, Province } from "../types/type";

export default function usePlaces({ useChain }: { useChain?: boolean }) {
  const [city, setCity] = useState<City | undefined>(undefined);
  const [province, setProvince] = useState<Province | undefined>(undefined);
  const [district, setDistrict] = useState<District | undefined>(undefined);
  const { data: { provinces } = {} } = useQuery<{
    provinces: Province[];
  }>(gql`
    query GetProvinces {
      provinces {
        id
        name
      }
    }
  `);
  const { data: { cities } = {}, refetch: refetchCity } = useQuery<{
    cities: City[];
  }>(
    gql`
      query GetProvinces($province_id: ID!) {
        cities(province_id: $province_id) {
          id
          name
        }
      }
    `,
    { variables: { province_id: province?.id } }
  );
  const { data: { districts } = {}, refetch: refetchDistrict } = useQuery<{
    districts: District[];
  }>(
    gql`
      query GetProvinces($city_id: ID!) {
        districts(city_id: $city_id) {
          id
          name
        }
      }
    `,
    { variables: { city_id: city?.id } }
  );

  useEffect(() => {
    refetchCity();
    setCity(undefined);
  }, [province, refetchCity, setCity]);

  useEffect(() => {
    refetchDistrict();
    setDistrict(undefined);
  }, [city, refetchDistrict, setDistrict]);

  return {
    provinces: provinces ?? [],
    cities: cities ?? [],
    districts: districts ?? [],
    setCity,
    setProvince,
    city,
    province,
    district,
    setDistrict,
  };
}
