const contract = 'KT1MxDwChiDwd6WBVs24g1NjERUoK622ZEFp';

const hexToChar = (str) =>
  str.match(/.{1,2}/g)
     .map((v) => String.fromCharCode(parseInt(v, 16)))
     .join('');

export const getTokens = async (tokenIds, balance = null) => {
  const url = `https://api.tzkt.io/v1/contracts/${contract}/bigmaps/rgb/keys`
            + (tokenIds.length === 1 ?
               '?key=' + tokenIds[0] :
               '?key.in=' + tokenIds.join(','));
  const r = await fetch(url , {method: 'GET'});
  const json = await r.json();
  const data = json.reduce((h, t) => {
    h[t.key] = {
      tokenId: t.key,
      rgb: t.value.rgb,
      addr: t.value.creater,
      creater: hexToChar(t.value.creater_name),
      name: hexToChar(t.value.token_name),
      description: hexToChar(t.value.token_description),
      balance: balance ? balance[t.key] : null,
    };
    return h;
  }, {});
  return tokenIds.map((id) => data[id]);
};

export const getAddrTokens = async (addr) => {
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
  return getTokens(tokenIds, balance);
};

export const getTzprofile = async (addr) => {
  const r = await fetch('https://indexer.tzprofiles.com/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: `{ tzprofiles_by_pk(account: \"${addr}\") { twitter } }`
    }),
  });
  const json = await r.json();
  return {
    twitter: json?.data?.tzprofiles_by_pk?.twitter || null,
  };
};
