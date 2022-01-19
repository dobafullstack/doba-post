import { Box } from "@chakra-ui/layout";
import { ReactNode } from "react";

type WrapperSize = "regular" | "small";

interface WrapperProps {
    children: ReactNode;
    size?: WrapperSize;
}

const Wrapper = ({ children, size = "regular" }: WrapperProps) => {
    return (
        <Box
            maxW={size === "regular" ? "800px" : "400px"}
            w='100%'
            mt={8}
            mx='auto'>
            {children}
        </Box>
    );
};

export default Wrapper;
