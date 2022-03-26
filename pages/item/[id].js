import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { getTokens } from '../../lib/8bidou';
import Token from '../../components/token';

export default function Item() {
  const router = useRouter();
  const id = router.query.id;

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (id) {
      (async () => {
        const tokens = await getTokens([id]);
        if (tokens.length) {
          setToken(tokens[0]);
        }
      })();
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>8bn | {id}</title>
      </Head>
      <Layout>
        {token && (
          <>
            <Row>
              <Col sm={6}>
                <div style={{
                  display: 'inline-block',
                  maxMidth: '400px',
                  border: '80px solid #fff'
                }}>
                  <Token size={240} token={token} />
                </div>
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Title:</th>
                      <td>
                        {token.name}{' '}
                        <a href={`https://8bidou.com/listing/?id=${id}`}
                           target="_blank" rel="noreferrer">
                          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">By:</th>
                      <td>
                        <Link href={`/profile/${token.addr}`}>
                          <a>{token.creater}</a>
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Description:</th>
                      <td>{token.description}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col sm={6}>
                <h3>Collectors</h3>
                <p>(soon...)</p>
              </Col>
            </Row>
          </>
        )}
      </Layout>
    </>
  );
}
