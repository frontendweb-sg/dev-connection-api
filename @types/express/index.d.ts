interface ICurentUser {
    id: string;
    email: string;
}

declare namespace Express {
    export interface Request {
        currentUser: ICurentUser;
    }
}
