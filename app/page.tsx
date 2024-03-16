import { Container } from '@mui/material';
import dynamic from 'next/dynamic';

import Form from '@/components/Form';
import Videos from '@/components/Videos';

const Providers = dynamic(() => import('../components/Providers'), {
  ssr: false
});

export default function Home() {
  return (
    <Providers>
      <Container
        sx={{
          py: '6rem'
        }}
      >
        <Form />
        <Videos />
      </Container>
    </Providers>
  );
}
