export const FileLabels = [
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

export const filesTableData = [
  {
    bucket: "file-pfe-devops-report-pdf",
    name: "PFE DevOps Report.pdf",
    size: 4739870,
    last_modified: "2024-06-03T12:42:25Z",
    created_at: "2024-06-03T12:42:25Z",
    labels: [FileLabels[0]],
    provider: 'aws'
  },
  {
    bucket: "file-pfe-devops-report-pdf",
    name: "PFE DevOps Report.pdf",
    size: 4739870,
    last_modified: "2024-06-03T12:42:25Z",
    created_at: "2024-06-03T12:42:25Z",
    labels: [FileLabels[1]],
    provider: 'aws'
  },
];
