export default class Position {
    public constructor(public row: string, public col: number) {}

    public static All(): Position[] {
        return [
            new Position('a', 0),
            new Position('a', 1),
            new Position('a', 2),
            new Position('b', 0),
            new Position('b', 1),
            new Position('b', 2),
            new Position('c', 0),
            new Position('c', 1),
            new Position('c', 2),
        ];
    }
}