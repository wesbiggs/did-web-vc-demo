import { cryptosuite } from "@digitalbazaar/eddsa-rdfc-2022-cryptosuite";
import { DataIntegrityProof } from "@digitalbazaar/data-integrity";
import * as vc from '@digitalbazaar/vc';
import * as credentialsContext from "@digitalbazaar/credentials-context";
import { CachedResolver } from "@digitalbazaar/did-io";
import * as didWeb from "@digitalbazaar/did-method-web";

// The credential we're verifying
import emailCredential from "./docs/email.json" assert { type: "json" };

const suite = new DataIntegrityProof({ cryptosuite });

const loaderCache = {};
function addToCache(options) {
  loaderCache[options.documentUrl] = { ...options };
}
["v2", "undefined-terms-v2"].forEach((shortName) => {
  const contextMetadata = credentialsContext.named.get(shortName);
  addToCache({
    document: contextMetadata.context,
    documentUrl: contextMetadata.id,
  });
});

const didResolver = new CachedResolver();
didResolver.use(didWeb.driver());

async function documentLoader(url) {
  if (url.startsWith("did:")) {
    const didDocument = await didResolver.get({ did: url });
    return { document: didDocument }
  }
  return loaderCache[url];
}
  
    
const output = await vc.verifyCredential({
  credential: emailCredential,
  suite,
  documentLoader
});

console.log(JSON.stringify(output, null, 2));
