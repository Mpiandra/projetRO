export interface Way {
    value : number | undefined;
    row : number;
    col : number;
}

export interface Element {
    elementValue : number | undefined | string;
    elementRow : number;
    elementCol : number;
    direction ?: string;
}
