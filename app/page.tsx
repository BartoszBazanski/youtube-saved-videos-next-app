import Providers from '@/components/Providers';
import Form from '@/components/Form';
import Videos from '@/components/Videos';

import { Container } from '@mui/material';

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
