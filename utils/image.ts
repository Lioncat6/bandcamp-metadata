import type { BandcampImage } from "../types/parsed-types.js";

function getId(url: string): number {
    const regex = /https:\/\/f4\.bcbits\.com\/img\/a?(\d+)_(?:\d+).[a-z]+/
    return Number(url.match(regex)?.[1])
}

function getUrl(options: { id: number, best?: boolean | undefined, a?: boolean | undefined }): string {
    return `https://f4.bcbits.com/img/${options.a ? 'a' : ''}${options.id}_${options.best ? '0.png' : '3.jpg'}`
}

function getImage(options: { idOrUrl: number | string, isId?: boolean, a?: boolean }): BandcampImage {
    const id = options.isId ? Number(options.idOrUrl) : getId(options.idOrUrl.toString());
    return {
        id,
        url: !options.isId ? options.idOrUrl.toString() : getUrl({id, a: options.a}),
        bestUrl: getUrl({id, best: true, a: options.a})
    }
}

const image = {
    getId,
    getUrl,
    getImage
}

export default image;