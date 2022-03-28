const tzapi = 'https://api.tzkt.io/v1';
const contract = 'KT1MxDwChiDwd6WBVs24g1NjERUoK622ZEFp';
const swap_contract = 'KT1BvWGFENd4CXW5F3u4n31xKfJhmBGipoqF';

const utf8decoder = new TextDecoder();

const hexToChar = (str) => {
  const ints = str.match(/.{1,2}/g).map((v) => parseInt(v, 16));
  return utf8decoder.decode(new Uint8Array(ints));
}

export const getTokens = async (tokenIds, balance = null) => {
  const url = `${tzapi}/contracts/${contract}/bigmaps/rgb/keys?`
            + (tokenIds.length === 1 ?
               'key=' + tokenIds[0] + '&limit=1' :
               'key.in=' + tokenIds.join(',') + '&limit=2000');
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
  const url = `${tzapi}/tokens/balances?` + new URLSearchParams([
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
  const url = `${tzapi}/tokens/balances?`
            + `token.contract=${contract}&token.tokenId=${tokenId}`;
  const r = await fetch(url, {method: 'GET'});
  const json = await r.json();
  return json.filter((o) => {
    return o.balance > 0 && o.account.address.slice(0, 2) === 'tz'
  });
};

export const rgbToDataURL = (rgbStr) => {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 16;
  const ctx = c.getContext('2d');
  const rgb = rgbStr.match(/.{1,6}/g).map((x) => '#' + x);
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y <8; y++) {
      ctx.fillStyle = rgb[x + y * 8];
      ctx.fillRect(x * 2, y * 2, 2, 2);
    }
  }
  return c.toDataURL('image/png');
};


export const getAddrSwaps = async(addr) => {
  const url = `${tzapi}/contracts/${swap_contract}/bigmaps/swap_list/keys?`
            + `value.seller=${addr}&value.nft_amount.gt=0`;
  const r = await fetch(url);
  return await r.json();
};

export const getTokenSwaps = async (tokenId) => {
  const url = `${tzapi}/contracts/${swap_contract}/bigmaps/swap_list/keys?`
            + `value.nft_id=${tokenId}&value.nft_amount.gt=0`;
  const r = await fetch(url , {method: 'GET'});
  return await r.json();
};

export const getSales = async(addr) => {
  const sales = [];

  const url = `${tzapi}/operations/transactions?` + new URLSearchParams([
    ['sender', swap_contract],
    ['target', addr],
    ['status', 'applied'],
    ['sort.desc', 'id'],
    ['limit', 100],
  ]);
  const ids = {};
  const r = await fetch(url);
  const json = await r.json();
  const hashes = {};
  const count = 0;
  for (let t of json) {
    if (t.hash in hashes) {
      continue;
    }
    hashes[t.hash] = true;
    count += 1;
    if (count > 50) {
      break;
    }
    const url2 = `${tzapi}/operations/transactions/${t.hash}`;
    const r2 = await fetch(url2);
    const json2 = await r2.json();
    for (let t2 of json2) {
      const id = t2.id;
      const timestamp = t2.timestamp;
      if (t2.diffs) {
        for (let d of t2.diffs) {
          if (d.content.value.nft_id) {
            const nft_id = d.content.value.nft_id;
            const payment = d.content.value.payment / 1e6;
            const seller = d.content.value.seller;
            const buyer = t.initiator.address;
            sales.push({id, timestamp, nft_id, payment, buyer, seller});
          }
        }
      }
    }
  }

  return sales;
};
