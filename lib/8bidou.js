const contract = 'KT1MxDwChiDwd6WBVs24g1NjERUoK622ZEFp';
const swap_contract = 'KT1BvWGFENd4CXW5F3u4n31xKfJhmBGipoqF';

const utf8decoder = new TextDecoder();

const hexToChar = (str) => {
  const ints = str.match(/.{1,2}/g).map((v) => parseInt(v, 16));
  return utf8decoder.decode(new Uint8Array(ints));
}

export const getTokens = async (tokenIds, balance = null) => {
  const url = `https://api.tzkt.io/v1/contracts/${contract}/bigmaps/rgb/keys`
            + (tokenIds.length === 1 ?
               '?key=' + tokenIds[0] + '&limit=1' :
               '?key.in=' + tokenIds.join(',') + '&limit=2000');
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

export const getOwners = async (tokenId) => {
  const url = 'https://api.tzkt.io/v1/tokens/balances'
            + `?token.contract=${contract}&token.tokenId=${tokenId}`;
  const r = await fetch(url, {method: 'GET'});
  const json = await r.json();
  return json.filter((o) => {
    return o.balance > 0 && o.account.address.slice(0, 2) === 'tz'
  });
};

export const getSwaps = async (tokenId) => {
  const url = 'https://api.tzkt.io/v1/contracts/' + swap_contract +
              '/bigmaps/swap_list/keys?value.nft_id=' + tokenId +
              '&value.nft_amount.gt=0';
  const r = await fetch(url , {method: 'GET'});
  const json = await r.json();
  return json;
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
