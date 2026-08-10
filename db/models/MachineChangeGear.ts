import { Model, Relation } from '@nozbe/watermelondb';
import { field, relation, text } from '@nozbe/watermelondb/decorators';
import type Machine from './Machine';

export default class MachineChangeGear extends Model {
  static table = 'machine_change_gears';

  static associations = {
    machines: { type: 'belongs_to' as const, key: 'machine_id' },
  };

  @text('machine_id') machineId: string;
  @field('teeth_count') teethCount: number;
  @field('quantity') quantity: number;
  @text('status') status: string;
  @field('is_universal') isUniversal: boolean;

  @relation('machines', 'machine_id') machine: Relation<Machine>;
}
