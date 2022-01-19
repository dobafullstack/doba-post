import React from "react";
import Navbar from "./Navbar";
import Wrapper from "./Wrapper";

interface Props {
    children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
    return (
        <>
            <Navbar />

            <Wrapper>{children}</Wrapper>
        </>
    );
};
