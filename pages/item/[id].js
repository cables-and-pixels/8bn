import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { getTokens, getOwners } from '../../lib/8bidou';
import Token from '../../components/token';

export default function Item() {
  const router = useRouter();
  const id = router.query.id;

  const [token, setToken] = useState(null);
  const [owners, setOwners] = useState(null);

  useEffect(() => {
    if (id) {
      (async () => {
        const tokens = await getTokens([id]);
        if (tokens.length) {
          setToken(tokens[0]);
          let owners = await getOwners(id);
          owners = owners.filter(o => {
            return o.balance > 0 && o.account.address.slice(0, 2) === 'tz';
          });
          setOwners(owners);
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
              <Col lg={6}>
                <div className="my-4" style={{
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
              <Col lg={6}>
                {owners && (
                  <>
                    <h3 className="my-4">Owners</h3>
                    <table>
                      <tbody>
                        {owners.map(o => (
                          <tr key={o.id}>
                            <td>
                              <Link href={`/profile/${o.account.address}`}>
                                <a>
                                  {o.account.alias ?
                                   o.account.alias : o.account.address}
                                </a>
                              </Link>
                            </td>
                            <td>
                              x{o.balance}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </Col>
            </Row>
          </>
        )}
      </Layout>
    </>
  );
}
