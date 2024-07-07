export class DockerImage {
  id: string;
  repository: string;
  format: string;
  group: string | null;
  name: string;
  version: string;
  assets: DockerImageAsset[];

  constructor(dockerImage: DockerImage) {
    this.id = dockerImage.id;
    this.repository = dockerImage.repository;
    this.format = dockerImage.format;
    this.group = dockerImage.group;
    this.name = dockerImage.name;
    this.version = dockerImage.version;
    this.assets = dockerImage.assets;
  }
}

export interface DockerImageAsset {
  downloadUrl: string;
  path: string;
  id: string;
  repository: string;
  format: string;
  checksum: DockerImageChecksum;
  contentType: string;
  lastModified: string;
  lastDownloaded: string | null;
  uploader: string;
  uploaderIp: string;
  fileSize: number;
  blobCreated: string;
}

export interface DockerImageChecksum {
  sha1: string;
  sha256: string;
}
