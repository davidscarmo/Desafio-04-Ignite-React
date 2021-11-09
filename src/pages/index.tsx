import { Button, Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useInfiniteQuery } from "react-query";

import { Header } from "../components/Header";
import { CardList } from "../components/CardList";
import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";

interface ImageProps 
{
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface GetImagesResponse {
  after: string;
  data: ImageProps[];
}

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = null }) : Promise<GetImagesResponse> =>
  {
    const { data } = await api.get("api/images", { params: {
      after: pageParam,
    }})

    return data;
  }
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    "images",
    fetchImages
    ,
    {
      getNextPageParam: (lastPage) => lastPage.after || null,
    }
  );

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(imageData => {
      return imageData.data.flat();
    })
    console.log(data?.pages)
    console.log(formatted)
    return formatted; 
  }, [data]);

  console.log(formattedData);
  if(isLoading && !isError) 
  {
    return <Loading />
   }

   if(!isLoading && isError)
   {
     return <Error />
   }

  // TODO RENDER ERROR SCREEN

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} /> 
       {hasNextPage && (
         <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} mt={6} >
            {isFetchingNextPage ? 'Carregando' : 'Carregar mais'}
         </Button>
       )}
      </Box>
    </>
  );
}
