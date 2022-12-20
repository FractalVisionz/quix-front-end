import Head from "next/head";
import { useEffect, useState } from "react";
import removeMd from "remove-markdown";
import { fetchToken } from "../../../../api/token";
import { Asset } from "../../../../components/Asset/Asset";
import { NotFound } from "../../../../components/NotFound/NotFound";
import { siteConfig } from "../../../../shared/config";
import { assetVisited } from "../../../../utils/mixpanel";

export const getServerSideProps = async ({ params }) => {
  let networkId = null;
  if (siteConfig.NETWORK == "opt-mainnet") {
    networkId = "eth-mainnet";
  } else if (siteConfig.NETWORK == "opt-goerli") {
    networkId = "eth-goerli";
  }
  const tokenParam = await fetchToken(
    params.contractId,
    params.tokenId,
    networkId
  );

  return {
    props: {
      tokenParam,
      key: params.tokenId,
    },
  };
};

const AssetPage = ({ tokenParam }) => {
  const [token, setToken] = useState(tokenParam);

  useEffect(() => {
    !!token && assetVisited(token.contract_address, token.token_id);
  });

  const formattedDescription = !!token ? removeMd(token.description) : "";

  return (
    <>
      {!!token ? (
        <>
          <Head>
            <title>{token.name} | Quix</title>
            <meta property="og:title" content={token.name + " - Quix"} />

            {token.description ? (
              <>
                <meta name="description" content={formattedDescription} />
                <meta
                  property="og:description"
                  content={formattedDescription}
                />
                <meta
                  name="twitter:description"
                  content={formattedDescription}
                />
              </>
            ) : (
              <>
                <meta
                  name="description"
                  content={`Discover, collect, and sell digital items on the largest NFT marketplace on Optimism. Transact in milliseconds and save up to 100x on gas fees.`}
                />
                <meta
                  property="og:description"
                  content={`Discover, collect, and sell digital items on the largest NFT marketplace on Optimism. Transact in milliseconds and save up to 100x on gas fees.`}
                />
                <meta
                  name="twitter:description"
                  content={`Discover, collect, and sell digital items on the largest NFT marketplace on Optimism. Transact in milliseconds and save up to 100x on gas fees.`}
                />
              </>
            )}

            {token.image ? (
              <>
                <meta property="og:image" content={token.image} />
                <meta name="twitter:image" content={token.image} />
              </>
            ) : (
              <>
                <meta property="og:image" content={`/opt_banner.png`} />
                <meta
                  name="twitter:image"
                  content={`https://${siteConfig.WEBSITE_URL}/opt_twitter.png`}
                />
              </>
            )}
          </Head>

          <Asset token={token} setToken={setToken} />
        </>
      ) : (
        <>
          <Head>
            <title>Not Found | Quix</title>
            <meta property="og:title" content={`Not Found | Quix`} />

            <meta
              name="description"
              content={`Discover, collect, and sell digital items on the largest NFT marketplace on Optimism. Transact in milliseconds and save up to 100x on gas fees.`}
            />
            <meta
              property="og:description"
              content={`Discover, collect, and sell digital items on the largest NFT marketplace on Optimism. Transact in milliseconds and save up to 100x on gas fees.`}
            />
            <meta
              name="twitter:description"
              content={`Discover, collect, and sell digital items on the largest NFT marketplace on Optimism. Transact in milliseconds and save up to 100x on gas fees.`}
            />

            <meta property="og:image" content={`/opt_banner.png`} />
            <meta
              name="twitter:image"
              content={`https://${siteConfig.WEBSITE_URL}/opt_twitter.png`}
            />
          </Head>

          <NotFound />
        </>
      )}
    </>
  );
};

export default AssetPage;