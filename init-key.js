import * as Ed25519Multikey from "@digitalbazaar/ed25519-multikey";

const controller = "did:web:wesbiggs.github.io:did-web-vc-demo";
const keyPair = await Ed25519Multikey.generate({controller});
const exportedKeyPair = await keyPair.export({ publicKey: true, secretKey: true });
console.log(JSON.stringify(exportedKeyPair, null, 2));

const assertionMethod = [await keyPair.export({ publicKey: true })];

console.log(JSON.stringify(
    {
      "@context": ["https://www.w3.org/ns/did/v1"],
      id: controller,
      assertionMethod,
    }, null, 2));
