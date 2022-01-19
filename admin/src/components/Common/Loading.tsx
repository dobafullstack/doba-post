
import { Flex } from '@chakra-ui/react'
import React from 'react'

export default function Loading({minH = "100vh"}: {minH?: string}) {
    return (
        <Flex minH={minH} w="100%" justify="center" align="center" gap={2} className='loading-wrapper'>
            <div className="loading loading-1" />
            <div className="loading loading-2" />
            <div className="loading loading-3" />
            <div className="loading loading-4" />
            <div className="loading loading-5" />
        </Flex>
    )
}
