import * as Ed25519Multikey from "@digitalbazaar/ed25519-multikey";
import { cryptosuite } from "@digitalbazaar/eddsa-rdfc-2022-cryptosuite";
import { DataIntegrityProof } from "@digitalbazaar/data-integrity";
import * as vc from '@digitalbazaar/vc';
import jsig from "jsonld-signatures";
const { extendContextLoader } = jsig;
import jsonld from "jsonld";
import dataIntegrityContext from "@digitalbazaar/data-integrity-context";
import * as credentialsContext from "@digitalbazaar/credentials-context";

//const nodeDocumentLoader = jsonld.documentLoaders.node();

const controller =  "did:web:wesbiggs.github.io:did-web-vc-demo";

// Output from init-key.js
const exportedKeyPair = {
  "@context": "https://w3id.org/security/multikey/v1",
  "id": "did:web:wesbiggs.github.io:did-web-vc-demo#z6MkqiErfb3trrdbuaMsPFz1WLq2Dk8411Q9ghb31feiu7CG",
  "type": "Multikey",
  "controller": "did:web:wesbiggs.github.io:did-web-vc-demo",
  "publicKeyMultibase": "z6MkqiErfb3trrdbuaMsPFz1WLq2Dk8411Q9ghb31feiu7CG",
  "secretKeyMultibase": "zrv3ZpiV65a4YucAbgzd68egdLvBHZrE697gbfYg7gvi96i737ZzB54aWyQ7ek221HACR8dCK7gpZJP7YpTDBoEKwFJ"
};
const keyPair = await Ed25519Multikey.from(exportedKeyPair);
const suite = new DataIntegrityProof({ signer: keyPair.signer(), cryptosuite });

const emailCredential = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://www.w3.org/ns/credentials/undefined-terms/v2"
  ],
  "type": [
    "VerifiedEmailAddressCredential",
    "VerifiableCredential"
  ],
  "issuer": controller,
  "credentialSchema": {
    "type": "JsonSchema",
    "id": "https://wesbiggs.github.io/did-web-vc-demo/verified-email-address.json"
  },
  "credentialSubject": {
    "id": "did:key:z6MkqiErfb3trrdbuaMsPFz1WLq2Dk8411Q9ghb31feiu7CG",
    "emailAddress": "joe.bloggs@example.com",
    "lastVerified": "2024-02-12T03:08:00Z"
  }
};

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

let documentLoader = extendContextLoader(async (url) => {
  return loaderCache[url];
});
  
    
const signedVC = await vc.issue({ credential: emailCredential, suite, documentLoader });

console.log(JSON.stringify(signedVC, null, 2));
