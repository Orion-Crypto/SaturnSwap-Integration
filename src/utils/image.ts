import { IPFSGateway } from '@/types/Enums/IPFSGateway';

export const convertIPFSToHTTP = (url: string, ipfs: IPFSGateway = IPFSGateway.NFTStorage) => {
    if (!isIPFSURL(url)) return url;

    const hash = url.replace('ipfs://', '');
    let newURL = `https://nftstorage.link/ipfs/${hash}`;
    if (ipfs === IPFSGateway.NFTStorage) {
        newURL = `https://nftstorage.link/ipfs/${hash}`;
    } else if (ipfs === IPFSGateway.Blockfrost) {
        newURL = `https://ipfs.blockfrost.dev/ipfs/${hash}`;
    } else if (ipfs === IPFSGateway.Pinata) {
        newURL = `https://gateway.pinata.cloud/ipfs/${hash}`;
    } else if (ipfs === IPFSGateway.Dweb) {
        newURL = `https://dweb.link/ipfs/${hash}`;
    } else if (ipfs === IPFSGateway.CfIPFS) {
        newURL = `https://cf-ipfs.com/ipfs/${hash}`;
    } else if (ipfs === IPFSGateway.IPFSio) {
        newURL = `https://ipfs.io/ipfs/${hash}`;
    }
    return newURL;
};

export const isIPFSURL = (url: string) => {
    if (url && url.startsWith('ipfs')) return true;
    return false;
};

export const isHttpsURL = (url: string) => {
    if (url && url.startsWith('https')) return true;
    return false;
};

export const isLocalURL = (url: string) => {
    if (url && url.startsWith('/images')) return true;
    return false;
};
