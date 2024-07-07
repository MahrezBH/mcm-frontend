export class File {
  id?: string;
  bucket: string;
  name: string;
  size?: number;
  last_modified?: string;
  created_at?: string;
  storage_class?: string;
  content_type?: string;
  labels?: any;
  provider: string;

  constructor(file: File) {
    this.id = file.id;
    this.bucket = file.bucket;
    this.name = file.name;
    this.size = file.size;
    this.last_modified = file.last_modified;
    this.created_at = file.created_at;
    this.storage_class = file.storage_class;
    this.content_type = file.content_type;
    this.labels = file.labels;
    this.provider = file.provider;
  }
}
