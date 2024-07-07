export const cloudProviderLabel = [
  {
    text: 'AWS',
    textClass: 'text-green-600',
    bgClass: 'bg-green-600/10',
    previewClass: 'bg-green-600',
    icon: 'aws'

  },
  {
    text: 'Microsoft Azure',
    textClass: 'text-cyan-600',
    bgClass: 'bg-cyan-600/10',
    previewClass: 'bg-cyan-600',
    icon: 'microsoft-azure',
  },
  {
    text: 'Hetzner',
    textClass: 'text-teal-600',
    bgClass: 'bg-teal-600/10',
    previewClass: 'bg-teal-600',
    icon: 'hetzner',
  },
  {
    text: 'Google Cloud Provider',
    textClass: 'text-purple-600',
    bgClass: 'bg-purple-600/10',
    previewClass: 'bg-purple-600',
    icon: 'google-cloud'
  }
];

export const Zones = [
  {
    text: 'us-east-1b',
    textClass: 'text-green-600',
    bgClass: 'bg-green-600/10',
    previewClass: 'bg-green-600'
  },
  {
    text: 'hel1-dc2',
    textClass: 'text-cyan-600',
    bgClass: 'bg-cyan-600/10',
    previewClass: 'bg-cyan-600'
  },
  {
    text: 'europe-west1-b',
    textClass: 'text-teal-600',
    bgClass: 'bg-teal-600/10',
    previewClass: 'bg-teal-600'
  },
  {
    text: 'francecentral',
    textClass: 'text-purple-600',
    bgClass: 'bg-purple-600/10',
    previewClass: 'bg-purple-600'
  }
];

export const Status = [
  {
    text: 'running',
    textClass: 'text-green-600',
    bgClass: 'bg-green-600/10',
    previewClass: 'bg-green-600'
  },
  {
    text: 'stopped',
    textClass: 'text-cyan-600',
    bgClass: 'bg-cyan-600/10',
    previewClass: 'bg-cyan-600'
  },
  {
    text: 'terminated',
    textClass: 'text-teal-600',
    bgClass: 'bg-teal-600/10',
    previewClass: 'bg-teal-600'
  },
];

export const instanceType = [
  {
    text: 't2.micro',
    textClass: 'text-green-600',
    bgClass: 'bg-green-600/10',
    previewClass: 'bg-green-600'
  },
  {
    text: 'Standard_DS1_v2',
    textClass: 'text-cyan-600',
    bgClass: 'bg-cyan-600/10',
    previewClass: 'bg-cyan-600'
  },
  {
    text: 'n1-standard-1',
    textClass: 'text-teal-600',
    bgClass: 'bg-teal-600/10',
    previewClass: 'bg-teal-600'
  },
  {
    text: 'cpx41',
    textClass: 'text-teal-600',
    bgClass: 'bg-teal-600/10',
    previewClass: 'bg-teal-600'
  },
  {
    text: 'cpx51',
    textClass: 'text-purple-600',
    bgClass: 'bg-purple-600/10',
    previewClass: 'bg-purple-600'
  }
];

export const aioTableData = [
  {
    id: "i-0af554b41e107eb7b",
    name: "Unnadsdsmed",
    status: Status[0],
    machine_type: instanceType[2],
    network_ip: "172.31.18.135",
    external_ip: "18.215.173.229",
    labels: [cloudProviderLabel[0], Zones[2]],
    created_at: "2024-06-02T17:05:03.000000Z",
  },
  {
    id: "i-0af554b41e107eb7b",
    name: "Unnamed",
    status: Status[1],
    created_at: "2024-06-02T17:05:03.000000Z",
    machine_type: instanceType[0],
    network_ip: "172.31.18.135",
    external_ip: "18.215.173.229",
    labels: [cloudProviderLabel[2], Zones[1]]
  },
  {
    id: "i-0af554b41e107eb7b",
    name: "Unnamed",
    status: Status[2],
    created_at: "2024-06-02T17:05:03.000000Z",
    machine_type: instanceType[1],
    network_ip: "172.31.18.135",
    external_ip: "18.215.173.229",
    labels: [cloudProviderLabel[1], Zones[0]]
  },
];
