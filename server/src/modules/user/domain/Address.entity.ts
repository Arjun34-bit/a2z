export interface AddressProps {
  id: string;
  user_id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export class Address {
  readonly id: string;
  readonly userId: string;
  readonly label: string | null;
  readonly line1: string;
  readonly line2: string | null;
  readonly city: string;
  readonly state: string;
  readonly pincode: string;
  readonly isDefault: boolean;

  constructor(data: AddressProps) {
    this.id = data.id;
    this.userId = data.user_id;
    this.label = data.label;
    this.line1 = data.line1;
    this.line2 = data.line2;
    this.city = data.city;
    this.state = data.state;
    this.pincode = data.pincode;
    this.isDefault = data.is_default;
  }
}
