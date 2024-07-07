export interface NodeAddress {
  type: string;
  address: string;
}

export interface Node {
  name: string;
  status: string;
  addresses: NodeAddress[];
}

export interface AgentPoolProfile {
  count: number;
  vm_size: string;
  os_disk_size_gb: number;
  os_type: string;
  provisioning_state: string;
  power_state: string;
  name: string;
}

export interface NetworkProfile {
  network_plugin: string;
  service_cidr: string;
  dns_service_ip: string;
  outbound_type: string;
  load_balancer_sku: string;
}

export class Cluster {
  id: string;
  name: string;
  location: any;
  provisioning_state: string;
  power_state: any;
  kubernetes_version: string;
  dns_prefix: string;
  fqdn: string;
  agent_pool_profiles: AgentPoolProfile[];
  node_resource_group: string;
  enable_rbac: boolean;
  network_profile: NetworkProfile;
  service_external_ip: string;
  labels?: any;
  nodes: Node[];  // Add nodes property
  showNodes?: boolean;
  constructor(cluster: any) {
    this.id = cluster.id;
    this.name = cluster.name;
    this.location = cluster.location;
    this.provisioning_state = cluster.provisioning_state;
    this.power_state = cluster.power_state;
    this.kubernetes_version = cluster.kubernetes_version;
    this.dns_prefix = cluster.dns_prefix;
    this.fqdn = cluster.fqdn;
    this.agent_pool_profiles = cluster.agent_pool_profiles;
    this.node_resource_group = cluster.node_resource_group;
    this.enable_rbac = cluster.enable_rbac;
    this.network_profile = cluster.network_profile;
    this.service_external_ip = cluster.service_external_ip;
    this.labels = cluster.labels;
    this.nodes = cluster.nodes || [];  // Initialize nodes
    this.showNodes = false;
  }
}
