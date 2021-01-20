export class Kaizen {
  text: string;
  id: string;
  userId: string;
  votes = 0;

  constructor(text: string, userId: string, id: string) {
    this.text = text;
    this.userId = userId;
    this.id = id;
  }
}
