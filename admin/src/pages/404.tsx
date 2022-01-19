import { ArrowBackIcon } from '@chakra-ui/icons';
import { Button, Flex, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import img from '../assets/images/404.png';

export default function Custom404() {
    const router = useRouter();

    return (
        <Flex bg="white" minH="100vh" justify="center" align="center" flexDir="column">
            <Image src={img.src} />
            <Button
                mt={20}
                colorScheme="primary.200"
                variant="outline"
                leftIcon={<ArrowBackIcon />}
                _hover={{
                    backgroundColor: 'primary.200',
                    color: 'white'
                }}
                onClick={() => router.replace('/')}
            >
                Go back to HomePage
            </Button>
        </Flex>
    );
}

Custom404.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
};
