export class User {
    id!: number;
    username!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
    jwtToken?: string;
    refreshToken?: string;
    role!: string;
    organisation?: string;
    photUrl?: string;
    firstLogin?: boolean;
    activatedDate?: Date;
    created_at?: Date;
    updated_at?: Date;

}
