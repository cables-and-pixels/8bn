import Container from 'react-bootstrap/Container';
import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Layout({ children }) {
  return (
    <>
      <main>
        <Container>
          {children}
        </Container>
      </main>
      <footer>
        <Container>
          <Row>
            <Col md={6}>
              <p>
                © 2022{' '} cables.and.pixels<br />
                <Link href="/profile/tz1WwNyzXEGvSxZDEvugnDghcsQabxHWcsvn">
                  <a>Creations</a>
                </Link>
                {' | '}
                <a href="https://twitter.com/CablesAndPixels"
                   target="_blank" rel="noreferrer">
                  Twitter
                </a>
              </p>
            </Col>
            <Col md={6}>
              <p className="text-md-end">
                Other resources<br />
                <a href="https://www.8bidou.com/"
                   target="_blank" rel="noreferrer">
                  8bidou.com
                </a>{' | '}
                <a href="https://8bidou-tools.vercel.app/"
                   target="_blank" rel="noreferrer">
                  8bidou pinkyblu&#39;s tools
                </a>
              </p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}
