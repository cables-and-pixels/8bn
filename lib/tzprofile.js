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
