import * as Ed25519Multikey from "@digitalbazaar/ed25519-multikey";
import { cryptosuite } from "@digitalbazaar/eddsa-rdfc-2022-cryptosuite";
import { DataIntegrityProof } from "@digitalbazaar/data-integrity";
import * as vc from '@digitalbazaar/vc';
import jsig from "jsonld-signatures";
const { extendContextLoader } = jsig;
import jsonld from "jsonld";
import dataIntegrityContext from "@digitalbazaar/data-integrity-context";
import * as credentialsContext from "@digitalbazaar/credentials-context";
import emailCredential from "./docs/email.json" assert { type: "json" };
import { CachedResolver } from "@digitalbazaar/did-io";
import * as didWeb from "@digitalbazaar/did-method-web";

const nodeDocumentLoader = jsonld.documentLoaders.node();

const suite = new DataIntegrityProof({ signer: null, cryptosuite });

const loaderCache = {};
function addToCache(options) {
  loaderCache[options.documentUrl] = { ...options };
}

addToCache({
  document: dataIntegrityContext.CONTEXT,
  documentUrl: dataIntegrityContext.CONTEXT_URL,
});

["v1", "v2", "undefined-terms-v2"].forEach((shortName) => {
  const contextMetadata = credentialsContext.named.get(shortName);
  addToCache({
    document: contextMetadata.context,
    documentUrl: contextMetadata.id,
  });
});

let didResolver = new CachedResolver();
didResolver.use(didWeb.driver());

let documentLoader = extendContextLoader(async (url) => {
  if (url.startsWith("did:")) {
    const fragmentIndex = url.lastIndexOf("#");
    const baseDid =
          fragmentIndex === -1 ? url : url.substring(0, fragmentIndex);
    const didDocument = await didResolver.get({ did: baseDid });
    if (didDocument) {
      let document = didDocument;
      // We have a DID document, but might only need a key identified by fragment
      
      if (fragmentIndex !== -1) {
        document = findAssertionMethod(
          didDocument,
          url.substring(fragmentIndex + 1),
        );
      }
      return {document};
    }
  }
  return loaderCache[url];
});
  
    
const output = await vc.verifyCredential({
  credential: emailCredential,
  suite,
  documentLoader,
  purpose: {
    validate: (proof) => {
      return {
        valid: proof.proofPurpose === "assertionMethod",
      };
    },
    match: (proof, options /*{ document, documentLoader }*/) => {
      return true;
    },
  }
});

console.log(JSON.stringify(output, null, 2));
