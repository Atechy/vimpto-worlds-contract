# Vimpto Worlds NFT Contract Specifications

Token type: ERC721
Metadata Storage: IPFS

Vimpto worlds is a decentralized metaverse as a service platform, world NFT owners will have the ability to create, edit, and publish worlds on our platform. worlds are tradable on the Ethereum blockchain and listed on opensea.

## Mint stages

### Partners program

during this period only members of our partners program can mint worlds. the first world will be free and we will whitelist two addresses to mint a maximum of 5 worlds. at a discounted price of 0.75 ETH per world. the whitelisted addresses will be able to mint without our interference not like the stages below.

- mintToPartner can be called by the owner only.

- will not have any payment attached to it.

- will add the "TO" address to a whitelist to mint more worlds using the whitelist function.

- will not be able to mint more than 5 worlds.

- we will add another address to a whitelist manually.

- owner can remove addresses from whitelist.

### Whitelist mint

we want to allow whitelisted addresses stored on our server to be able to mint up to 5 worlds each.
the mint payload will be signed by our backend using the admin private key which should only be valid for paid mints, no free mints will be associated with this admin address.

- Only whitelisted addresses can mint worlds.

- Only owner can add whitelist addresses

- should be able to add addresses in bulk

- Owner can remove addresses from the WL

- Whitelist addresses mint at the whitelist price

- Whitelisted addresses adhere to the same mint limit as the public mint.

- Owner should be able to change the whitelist price.

- If the whitelisted address is also a partner he should be able to mint 5 + 1 worlds.

### public mint

The public mint we will be using the same endpoint of the Whitelist mint except we are going to sign all requests and remove the criteria for whitelisting on our server.

- each whitelist address can mint up to 5 worlds.

- all mint transactions should be signed by the backend using the admin private key.

- owner can change the admin private key.

- limit the mint to 5 worlds per address.

### reveal

All minted NFT will have a temporary image and a temporary description.

During the mint the IPFS hash will point to t a temporary image and description.

on the reveal event we will update the IPFS hash to point to the permanent image and description as follows: `([IPFS_GATEWAY]/[IPFS_HASH]/[TOKEN_ID].json)`

Class information will be stored on the json object.

## Royalities

We want to collect 10% royalties from secondary market sales on opensea and LooksRare.

## Tiers

| Tier    | Supply |
| ------- | ------ |
| Class S | 100    |
| Class A | 900    |
| Class B | 2000   |
| Class C | 7000   |

These are the four tiers of worlds assigned randomly in the json files. random distribution is managed by the server side to ensure that the tiers are distributed fairly and no one can improve the chances of minting higher tiers NFTs.

## Transfers

- all transfers should be locked on contract deployment.

- transfers can be unlocked by the owner but cannot be locked again.

- transfers will be enabled automatically when all NFT has been sold out.
