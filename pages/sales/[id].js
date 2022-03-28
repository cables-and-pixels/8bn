import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/layout';
import { getSales } from '../../lib/8bidou';

const base = 'http://localhost:3000';

export default function Sales() {
  const router = useRouter();
  const addr = router.query.id;

  const [data, setData] = useState({
    sales: [],
  });

  useEffect(() => {
    (async () => {
      if (addr) {
        const sales = await getSales(addr);
        setData({sales});
      }
    })();
  }, [addr]);

  return (
    <Layout>
      {data.sales && (
        <>
          <h1>Sales</h1>
          <table className="table-sm">
            <tbody>
              <tr>
                <th>date</th>
                <th>nft_id</th>
                <th>payment</th>
                <th>buyer</th>
                <th>seller</th>
              </tr>
              {data.sales.map(s => (
                <tr key={s.id}>
                  <td>{s.timestamp}</td>
                  <td>
                    <Link href={`/item/${s.nft_id}`}>
                      <a>{s.nft_id}</a>
                    </Link>
                  </td>
                  <td>{s.payment}</td>
                  <td>
                    <Link href={`/profile/${s.buyer}`}>
                      <a>{s.buyer}</a>
                    </Link>
                  </td>
                  <td>
                    <Link href={`/profile/${s.seller}`}>
                      <a>{s.seller}</a>
                    </Link>
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
