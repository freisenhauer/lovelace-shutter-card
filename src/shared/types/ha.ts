export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<void>;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributes;
}

export interface HassEntityAttributes {
  friendly_name?: string;
  icon?: string;
  current_position?: number;
  [key: string]: unknown;
}
