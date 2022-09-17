import { ArtworkAsset } from "./artworkAsset";

export class Artwork {
    id!: number;
    title!: string;
    description?: string;
    artType!: string;
    moreInfo?: string;
    approved?: boolean;
    approvedDate?: string;
    ExhibitId?: number;
    UserId?: number;
    userName?: string;
    createdAt?: string;
    exhibitName?: string;
    assetCount?: number;
    ArtworkAssets?: ArtworkAsset[];
}
