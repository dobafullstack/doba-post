import { useRouter } from 'next/router';

const Index = () => {
    const router = useRouter();

    router.replace('/app/post');

    return <></>;
};

export default Index;
