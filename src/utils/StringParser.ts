export class StringParser {
    public toBoolean(string: string): boolean {
        return /^\s*(true|1|on)\s*$/i.test(string);
    }

    public toNumber(string: string): number {
        const number = Number.parseInt(string);

        if (Number.isNaN(number)) {
            return -1;
        }

        return number;
    }

    public toFloat(string: string): number {
        const number = Number.parseFloat(string);

        if (Number.isNaN(number)) {
            return -1;
        }

        return number;
    }
}