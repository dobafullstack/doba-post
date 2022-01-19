import { useRouter } from "next/router";


const Index = () => {
  const router = useRouter();

  router.replace('/app/dashboard');

  return <></>
}

export default Index
