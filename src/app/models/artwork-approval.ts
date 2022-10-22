import { Artwork } from "./artwork";
import { User } from "./user";

export class ArtworkApproval {
    id!: number;
    ArtworkId!: number;
    UserId!: number;
    comment?: string = '';
    resolved?: false;
    approvedDate?: Date;
    approvedBy?: number;
    Artwork!: Artwork;
    User!: User;
}
