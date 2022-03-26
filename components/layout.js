import Container from 'react-bootstrap/Container';

export default function Layout({ children }) {
  return (
    <>
      <main>
        <Container>
          {children}
        </Container>
      </main>
    </>
  );
}
