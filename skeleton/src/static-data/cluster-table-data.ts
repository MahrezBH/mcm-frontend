import { Cluster } from "src/app/pages/clusters/interfaces/cluster.model";
import { Status, Zones } from "./aio-table-data";

export const CLUSTERS_DATA: Cluster[] = [
  {
    "id": "/subscriptions/0cd7aaef-4bd3-4345-abcb-33372b5671e5/resourcegroups/ilef-group/providers/Microsoft.ContainerService/managedClusters/cluster-ilef-cloud-backend-v1-r3a7",
    "name": "cluster-ilef-cloud-backend-v1-r3a7",
    "location": "francecentral",
    "provisioning_state": "Succeeded",
    "power_state": "Running",
    "kubernetes_version": "1.28",
    "dns_prefix": "cluster-ilef-cloud-backend-v1-r3a7",
    "fqdn": "cluster-ilef-cloud-backend-v1-r3a7-k0ebmyim.hcp.francecentral.azmk8s.io",
    "agent_pool_profiles": [
      {
        "count": 3,
        "vm_size": "Standard_DS2_v2",
        "os_disk_size_gb": 128,
        "os_type": "Linux",
        "provisioning_state": "Succeeded",
        "power_state": "Running",
        "name": "nodepool1"
      }
    ],
    "node_resource_group": "MC_ilef-group_cluster-ilef-cloud-backend-v1-r3a7_francecentral",
    "enable_rbac": true,
    "network_profile": {
      "network_plugin": "azure",
      "service_cidr": "10.0.0.0/16",
      "dns_service_ip": "10.0.0.10",
      "outbound_type": "loadBalancer",
      "load_balancer_sku": "Standard"
    },
    "service_external_ip": "98.66.241.244",
    nodes: [
      {
        "name": "aks-nodepool1-32438165-vmss000000",
        "status": "Ready",
        "addresses": [
          {
            "type": "InternalIP",
            "address": "10.224.0.62"
          },
          {
            "type": "Hostname",
            "address": "aks-nodepool1-32438165-vmss000000"
          }
        ]
      },
      {
        "name": "aks-nodepool1-32438165-vmss000001",
        "status": "Ready",
        "addresses": [
          {
            "type": "InternalIP",
            "address": "10.224.0.33"
          },
          {
            "type": "Hostname",
            "address": "aks-nodepool1-32438165-vmss000001"
          }
        ]
      },
      {
        "name": "aks-nodepool1-32438165-vmss000002",
        "status": "Ready",
        "addresses": [
          {
            "type": "InternalIP",
            "address": "10.224.0.4"
          },
          {
            "type": "Hostname",
            "address": "aks-nodepool1-32438165-vmss000002"
          }
        ]
      }
    ]
  }
];
