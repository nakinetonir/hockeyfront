export interface TeamBrand {
  key: string;
  name: string;
  logo: string;
  aliases: string[];
  specialAnimation?: '360';
}

const TEAM_BRANDS: TeamBrand[] = [
  {
    key: '360',
    name: 'Club Tres60',
    logo: '/assets/teams/360.png',
    aliases: ['360', 'tres60', 'tres 60', 'club tres60', 'club 360'],
    specialAnimation: '360'
  },
  {
    key: 'las-rozas',
    name: 'CHC Las Rozas',
    logo: '/assets/teams/lasrozas.png',
    aliases: ['las rozas', 'chc', 'chc las rozas', 'club hockey las rozas']
  },
  {
    key: 'lobos',
    name: 'Lobos',
    logo: '/assets/teams/lobos.png',
    aliases: ['lobos', 'club lobos', 'lobos hockey']
  },
  {
    key: 'madrid-patina',
    name: 'Madrid Patina',
    logo: '/assets/teams/madridpatina.png',
    aliases: ['madrid patina', 'madrid patina stars', 'stars', 'madridpatina']
  },
  {
    key: 'mamuts',
    name: 'Mamuts de Villaverde',
    logo: '/assets/teams/mamuts.png',
    aliases: ['mamuts', 'mamuts de villaverde', 'villaverde']
  },
  {
    key: 'pinguinos',
    name: 'Pinguinos',
    logo: '/assets/teams/pinguinos.png',
    aliases: ['pinguinos', 'pinguinos madrid', 'penguins']
  },
  {
    key: 'renos',
    name: 'Ciudad Patin Renos',
    logo: '/assets/teams/renos.png',
    aliases: ['renos', 'ciudad patin renos', 'ciudad patin']
  },
  {
    key: 'rolleybears',
    name: 'Rollybears Parla',
    logo: '/assets/teams/rolleybeers.png',
    aliases: ['rollybears', 'rolleybears', 'parla', 'rollybears parla']
  },
  {
    key: 'tirso',
    name: 'Club Patín Tirso',
    logo: '/assets/teams/tirso.png',
    aliases: [
      'tirso',
      'club patin tirso',
      'club patín tirso',
      'cpt tirso',
      'tirso madrid',
      'club patin tirso madrid',
      'club patin tirso de molina',
      'cp tirso',
      'c p tirso'
    ]
  },
  {
    key: 'vikings',
    name: 'CPLG Vikings',
    logo: '/assets/teams/vikings.png',
    aliases: ['vikings', 'vikins', 'cplg', 'cplg vikings']
  }
];

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function getTeamBrand(team?: string | null): TeamBrand | undefined {
  if (!team) {
    return undefined;
  }

  const normalizedTeam = normalize(team);
  return TEAM_BRANDS.find((brand) =>
    brand.aliases.some((alias) => {
      const normalizedAlias = normalize(alias);
      return normalizedTeam === normalizedAlias || normalizedTeam.includes(normalizedAlias) || normalizedAlias.includes(normalizedTeam);
    })
  );
}

export function isTeam360(team?: string | null): boolean {
  return getTeamBrand(team)?.specialAnimation === '360';
}

export function filterByTeamText<T>(items: T[], selector: (item: T) => string | undefined | null, teamSearch: string): T[] {
  const query = normalize(teamSearch || '');
  if (!query) {
    return items;
  }

  return items.filter((item) => normalize(selector(item) || '').includes(query));
}
