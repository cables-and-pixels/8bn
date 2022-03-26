import { useState, useEffect, useRef } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
const hexToChar = (str) =>
  str.match(/.{1,2}/g)
     .map((v) => String.fromCharCode(parseInt(v, 16)))
     .join('');

const getTokens = async (addr) => {
  const contract = 'KT1MxDwChiDwd6WBVs24g1NjERUoK622ZEFp';
  const url = 'https://api.tzkt.io/v1/tokens/balances'
            + '?' + new URLSearchParams([
              ['account', addr],
              ['token.contract', contract],
              ['limit', 2000],
            ]);
  const r = await fetch(url, {method: 'GET'});
  const json = await r.json();

  if (json.length === 0) {
    return [];
  }

  const balance = json.reduce((h, t) => {
    h[t.token.tokenId] = t.balance;
    return h;
  }, {});

  const tokenIds = json.map((t) => t.token.tokenId);

  const url2 =
    `https://api.tzkt.io/v1/contracts/${contract}/bigmaps/rgb/keys`
    + (tokenIds.length === 1 ?
       '?key=' + tokenIds[0] :
       '?key.in=' + tokenIds.join(','));
  const r2 = await fetch(url2, {method: 'GET'});
  const json2 = await r2.json();
  return json2.map((t) => {
    return {
      tokenId: t.key,
      rgb: t.value.rgb,
      addr: t.value.creater,
      creater: hexToChar(t.value.creater_name),
      name: hexToChar(t.value.token_name),
      balance: balance[t.key],
    };
  });
}

const getTzprofile = async (id) => {
  const r = await fetch('https://indexer.tzprofiles.com/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: `{ tzprofiles_by_pk(account: \"${id}\") { twitter } }`}),
  });
  const json = await r.json();
  return {
    twitter: json?.data?.tzprofiles_by_pk?.twitter || null,
  };
}

export default function Profile() {
  const router = useRouter();
  const addr = router.query.addr;

  const [tokens, setTokens] = useState(null);
  const [tzprofile, setTzprofile] = useState({loading: false});

  useEffect(() => {
    if (addr) {
      setTokens([]);
      (async () => {
        setTokens(await getTokens(addr));
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

  return (
    <Layout>
      <b>{addr}</b>{' '}
      <a href={'https://8bidou.com/inventory/?addr=' + addr}>
        <b><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></b>
      </a>
      {tzprofile?.loading && (
        <p>...</p>
      )}
      {tzprofile?.twitter && (
        <p className="mt-1">
          <strong><TwitterLink name={tzprofile.twitter} /></strong>
        </p>
      )}
      <div id={addr}>
        <h3>Creations</h3>
        {tokens &&
         <Row className="justify-content-md-left">
           {tokens.map(t =>
             t.addr === addr && <Token link={false} key={t.tokenId} token={t} />
           )}
         </Row>
        }
        <h3>Collection</h3>
        {tokens &&
         <Row className="justify-content-md-left">
           {tokens.map(t =>
             t.addr !== addr && <Token link={true} key={t.tokenId} token={t} />
           )}
         </Row>
        }
      </div>
    </Layout>
  );
}

function Token(props) {
  const t = props.token;
  const cRef = useRef(null);

  useEffect(() => {
    const rgb = t.rgb.match(/.{1,6}/g).map((x) => '#' + x);
    const c = cRef.current;
    const ctx = c.getContext('2d');
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y <8; y++) {
        ctx.fillStyle = rgb[x + y * 8];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });

  let canvas = (
    <canvas title={t.creater} ref={cRef} width={8} height={8} style={{
      imageRendering: 'pixelated',
      width: '64px',
      height: '64px'
    }} />
  );
  if (props.link) {
    canvas = (
      <Link href={`/profile/${t.addr}`}>
        <a>{canvas}</a>
      </Link>
    );
  }

  return (
    <Col xs="auto">
      {canvas}
      <p>x{t.balance}</p>
    </Col>
  );
}

function TwitterLink(props) {
  return (
    <a href={`https://twitter.com/${props.name}`}
       target="_blank" rel="noreferrer">
      @{props.name}
    </a>
  );
}
