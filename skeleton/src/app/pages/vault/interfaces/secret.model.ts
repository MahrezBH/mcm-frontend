export class Secret {
  id: string;
  key: string;
  value: string;

  constructor(key: any) {
    this.id = key.id;
    this.key = key.key;
    this.value = key.value;
  }
}