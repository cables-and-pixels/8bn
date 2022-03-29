import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout';

function Home() {
  const [tzAddr, setTzAddr] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tzAddr !== '') {
      router.push(`/profile/${tzAddr}`);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="form-group m-3">
          <label htmlFor="tzaddr">Tezos address:</label>
          <input id="tzaddr"
                 className="form-control"
                 placeholder="tz..."
                 onChange={(e) => setTzAddr(e.target.value)}/>
        </div>
        <div className="m-3">
          <button type="submit" className="btn btn-primary">
            Go
          </button>
        </div>
      </form>
    </Layout>
  );
}
