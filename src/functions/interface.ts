export interface Way {
    value : number | undefined;
    row : number;
    col : number;
}

export type Element = {
    elementValue: string;
    elementRow: number;
    elementCol: number;
    direction: 'forward' | 'backward';
};

