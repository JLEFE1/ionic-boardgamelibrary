export class Boardgame {
  constructor(
    public title: string,
    public gameType?: string,
    public numberOfPlayers?: number,
    public duration?: number
  ) { }
}
