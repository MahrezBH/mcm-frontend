export class Instance {
  id?: number | null;
  name?: string | null;
  status?: string | null;
  created_at?: string | null;
  zone?: string | null;
  machine_type?: string | null;
  network_ip?: string | null;
  external_ip?: string | null;
  labels?: any | null;
  provider?: string | null;
  key_pair_name?: string | null;

  constructor(instance: any) {
    this.id = instance.id;
    this.name = instance.name === "Unnamed" ? instance.id : instance.name;
    this.status = instance.status;
    this.provider = instance.provider;
    this.created_at = instance.created_at;
    this.zone = instance.zone;
    this.machine_type = instance.machine_type;
    this.network_ip = instance.network_ip;
    this.external_ip = instance.external_ip;
    this.labels = instance.labels;
  }
}