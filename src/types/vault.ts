export interface VaultItem {
    _id: string;
    type: 'password' | 'note';
    title: string;
    username?: string;
    password?: string;
    url?: string;
    note?: string;
    created_at: string;
}
