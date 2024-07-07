export type Provider = 'aws' | 'azure' | 'gcp' | 'hetzner';

export const machineTypes: Record<Provider, string[]> = {
    aws: [
        't2.micro',
        't3.nano',
        't3.micro',
        't3.small',
        't3.medium',
        't3.large',
        't3.xlarge',
        't3.2xlarge'
    ],
    azure: [
        'Standard_DS1_v2',
        'Standard_DS2_v2',
        'Standard_DS3_v2'
    ],
    gcp: [
        'n1-standard-1',
        'n1-standard-2',
        'n1-standard-4'
    ],
    hetzner: [
        'cpx31',
        'cpx41',
        'cpx51'
    ]
};

export const zones: Record<Provider, string[]> = {
    aws: [
        'us-east-1b',
        'us-east-1c',
        'us-west-2a'
    ],
    azure: [
        'francecentral',
        'westfeurope'
    ],
    gcp: [
        'europe-west1-b',
        'us-central1-a'
    ],
    hetzner: [
        'hel1-dc2',
        'nbg1-dc3'
    ]
};
