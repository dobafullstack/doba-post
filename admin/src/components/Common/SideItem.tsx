import { Icon, LinkBox, LinkOverlay } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import { IconType } from 'react-icons/lib';


interface Props {
    label: string;
    path: string;
    icon?: IconType;
}

export default function SideItem({ label, path, icon }: Props): ReactElement {
    const router = useRouter();
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (router.pathname.includes(path)) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [router.pathname]);

    return (
        <LinkBox
            as="article"
            bg={active ? 'primary.200' : 'gray.50'}
            color={active ? 'white' : 'black'}
            w="100%"
            minH="50px"
            borderRadius={8}
            px={5}
            transition="all 0.5s"
            _hover={{
                backgroundColor: 'primary.100',
                color: 'white',
            }}
            mb="4"
            display="flex"
            gap={5}
            alignItems="center"
        >
            {icon && <Icon as={icon} />}
            <NextLink href={`${path}`} passHref>
                <LinkOverlay>{label}</LinkOverlay>
            </NextLink>
        </LinkBox>
    );
}
