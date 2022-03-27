import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import { getAddrTokens, getTzprofile, rgbToDataURL } from '../../lib/8bidou';
import TwitterLink from '../../components/twlink';
import Token from '../../components/token';

export default function Profile() {
  const router = useRouter();
  const addr = router.query.addr;

  const [tokens, setTokens] = useState(null);
  const [tzprofile, setTzprofile] = useState({loading: false});
  const [favicon, setFavicon] = useState('/nanosillon-32.png');

  const creations = useMemo(() => {
    return tokens ? tokens.filter((t) => t && t.addr === addr) : [];
  }, [addr, tokens]);

  const collection = useMemo(() => {
    return tokens ? tokens.filter((t) => t && t.addr !== addr) : [];
  }, [addr, tokens]);

  useEffect(() => {
    if (addr) {
      setTokens([]);
      (async () => {
        setTokens(await getAddrTokens(addr));
      })();
    }
  }, [addr]);

  useEffect(() => {
    if (addr) {
      setTzprofile({loading: true});
      (async () => {
        setTzprofile(await getTzprofile(addr));
      })();
    }
    else {
      setTzprofile({loading: false});
    }
  }, [addr]);

  useEffect(() => {
    let rgb = (creations.length ?
               creations[0].rgb :
               (collection.length ?
                collection[0].rgb :
                null));
    if (rgb) {
      setFavicon(rgbToDataURL(rgb));
    }
    console.log(rgb);
  }, [creations, collection]);

  return (
    <>
      <Head>
        <title>8bn | {addr}</title>
        <link rel="icon" href={favicon} />
      </Head>
      <Layout>
        <p>
          <b>{addr}</b>
          {' '}
          <a href={`https://8bidou.com/inventory/?addr=${addr}`}
             target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
        </p>
        <p className="mt-1">
          {tzprofile?.loading && (
            <span>...</span>
          )}
          {tzprofile?.twitter && (
            <strong><TwitterLink name={tzprofile.twitter} /></strong>
          )}
          {!(tzprofile?.twitter) && ' '}
        </p>
        <div id={addr}>
          {creations && (
            <>
              <h3 className="my-4">Creations</h3>
              <Row className="justify-content-md-left">
                {creations.map(t =>
                  <Col xs="auto" key={t.tokenId}>
                    <p><Token link={`/item/${t.tokenId}`} token={t} /></p>
                  </Col>
                )}
              </Row>
            </>
          )}
          {collection && (
            <>
              <h3 className="my-4">Collection</h3>
              <Row className="justify-content-md-left">
                {collection.map(t =>
                  <Col xs="auto" key={t.tokenId}>
                    <p><Token token={t} link={`/profile/${t.addr}`} /></p>
                  </Col>
                )}
              </Row>
            </>
          )}
        </div>
      </Layout>
    </>
  );
}
