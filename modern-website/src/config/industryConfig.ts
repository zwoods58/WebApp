export const INDUSTRY_CONFIG = {
  retail:    { services: true, inventory: true, appointments: false },
  food:      { services: true, inventory: true, appointments: true  },
  transport: { services: true, inventory: false, appointments: true },
  salon:     { services: true, inventory: true, appointments: true  },
  tailor:    { services: true, inventory: true, appointments: true  },
  repairs:   { services: true, inventory: true, appointments: true  },
  freelance: { services: true, inventory: false, appointments: true },
} as const;
