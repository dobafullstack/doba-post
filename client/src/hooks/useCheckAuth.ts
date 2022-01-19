import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGetUserQuery } from "../graphql/graphql";

export const useCheckAuth = () => {
    const router = useRouter();

    const { loading, data } = useGetUserQuery();

    useEffect(() => {
        if (
            !loading &&
            data?.getUser &&
            (router.route === "/login" || router.route === "/register")
        ) {
            router.push("/");
        }
    }, [data, loading, router]);

    return { data, loading };
};
