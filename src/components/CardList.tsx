import { color, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards?: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { onOpen, isOpen, onClose} = useDisclosure();

  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const handleViewImage = (url: string): void => {
    onOpen()
    setCurrentImageUrl(url)
  }

  // TODO SELECTED IMAGE URL STATE

  // TODO FUNCTION HANDLE VIEW IMAGE

  return (
    <>
      {
        <SimpleGrid columns={[1,
        2,3]} spacing="40px">

          {
            cards.map(card =>
              {
               return  <Card
               key={card.id}
                data={card}
                viewImage={handleViewImage}
                />
              })
          }
         
       
       
        </SimpleGrid>
      }

      <ModalViewImage imgUrl={currentImageUrl} onClose={onClose} isOpen={isOpen} />

     
    </>
  );
}
