import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAddrSwaps } from '../../lib/8bidou';
import Layout from '../../components/layout';

export default function Home() {
  const router = useRouter();
  const addr = router.query.id;
  const [data, setData] = useState({swaps: []});

  useEffect(() => {
    (async () => {
      const swaps = await getAddrSwaps(addr);
      setData({swaps});
    })();
  }, [addr]);

  return (
    <Layout>
      {data.swaps.length && (
        <>
          <h1>Swaps</h1>
          <table className="table">
            <tbody>
              <tr>
                <th>Item</th>
                <th>Swap</th>
                <th>Amount</th>
              </tr>
              {data.swaps.map(s => (
                <tr key={s.id}>
                  <td>
                    <a href={`/item/${s.value.nft_id}`}
                       target="_blank" rel="noreferrer">
                      {s.value.nft_id}
                    </a>
                  </td>
                  <td>
                    <a href={`https://8bidou.com/item_detail/?id=${s.value.swap_id}`}
                       target="_blank" rel="noreferrer">
                      {s.value.swap_id}
                    </a>
                  </td>
                  <td>
                    x{s.value.nft_amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Layout>
  );
}
