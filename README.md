# did:web demo with Verifiable Credentials

This repo provides a simple JavaScript example that sets up a did:web DID via Github Pages, and demonstrates verifying a Verifiable Credential with the public key in the DID document.

## Code

- `init-key.js` creates an ed25519 key pair and DID document
- `issue.js` issues a Verifiable Credential using a key generated from the previous step
- `verify.js` verifies the Verifiable Credential against the DID document found online using a did:web URI

## Artifacts

These artifacts in the `docs/` directory are published to Github Pages:

- [`did.json`](https://wesbiggs.github.io/did-web-vc-demo/did.json) is a DID document. It follows the naming convention for did:web and can be referenced as `did:web:wesbiggs.github.io:did-web-vc-demo`
- [`email.json`](https://wesbiggs.github.io/did-web-vc-demo/email.json) is a signed Verifiable Credential generated from `issue.js`
- [`verified-email-address-credential.json`](https://wesbiggs.github.io/did-web-vc-demo/verified-email-address.json) is a JSON schema for the credential (here for demonstration purposes only)

## Notes

Feedback gratefully welcomed via Github Issues.

Thank you to Digital Bazaar for the core open source libraries this demo relies on.
