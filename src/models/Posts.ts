export class Post {
  id: number = 0;
  title: string = "";
  content: string = "";
  author: string = "";
  

  constructor (content: string) {
    this.id = Math.round(Math.random() * 1000);
    this.title = content;
    this.content = content;
    this.author = content;
  }
}