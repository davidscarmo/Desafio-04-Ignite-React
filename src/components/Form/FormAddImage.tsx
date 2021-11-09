import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}
type NewImgDataProps = {
  title: string ;
  description: string ;
  url: string;
  image?: FileList;
};
export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      imageRequired: 'Arquivo obrigatório',
      lessThan10MB: 'O arquivo deve ser menor que 10MB',
      acceptedFormats: 'Somente são aceitos arquivos PNG, JPEG e GIF.',
    },
    title: {
      titleRequired: 'Título obrigatório',
      minLength: 'Mínimo de 2 caracteres',
      maxLength: 'Máximo de 20 caracteres',
    },
    description: {
      descriptionRequired: 'Descrição obrigatória',
      maxLength: 'Máximo de 65 caracteres',
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data: NewImgDataProps) => {
      const response = await api.post('api/images', {
        ...data,
        url: imageUrl
      });

      console.log(response);
    },
    // TODO MUTATION API POST REQUEST,
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries("images")
      }
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: NewImgDataProps): Promise<void> => {
    try {
      console.log(data.image)
      const imgURL = URL.createObjectURL(data.image[0]);
      setLocalImageUrl(imgURL);
      console.log(imgURL)
      if(imageUrl.length <= 0) {
        toast({
          title: "Imagem não adicionada",
          description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
   
      
      await mutation.mutateAsync(data);
      toast({
        title: "Imagem cadastrada",
        description: "Sua imagem foi cadastrada com sucesso.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Falha no cadastro",
        description: "Ocorreu um erro ao tentar cadastrar a sua imagem.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      console.log('dashdsau');
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      setImageUrl('');
      setLocalImageUrl('')
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', {
            required: {
              value: true,
              message: formValidations.image.imageRequired,
            },
            validate: {
              lessThan10MB: value =>
                value[0].size < 10 * 1024 * 1024 ||
                formValidations.image.lessThan10MB,
              acceptedFormats: value =>
                /\/(jpe?g|png|gif)$/i.test(value[0].type) ||
                formValidations.image.acceptedFormats,
            },
          })}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', {
            required: {
              value: true,
              message: formValidations.title.titleRequired,
            },
            minLength: { value: 2, message: formValidations.title.minLength },
            maxLength: { value: 20, message: formValidations.title.maxLength },
          })}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', {
            required: {
              value: true,
              message: formValidations.description.descriptionRequired,
            },
            maxLength: {
              value: 65,
              message: formValidations.description.maxLength,
            },
          })}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
