import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, relation, text } from '@nozbe/watermelondb/decorators';
import type Machine from './Machine';

export default class RatioLookupCache extends Model {
  static table = 'ratio_lookup_cache';

  static associations = {
    machines: { type: 'belongs_to' as const, key: 'machine_id' },
  };

  @text('machine_id') machineId: string;
  @field('teeth_count') teethCount: number;
  @field('helix_angle') helixAngle: number;
  @field('module_or_dp') moduleOrDp: number;
  @text('gear_abcd_json') gearAbcdJson: string;
  @field('calculation_precision') calculationPrecision: number;
  @date('last_used_at') lastUsedAt: Date;

  @relation('machines', 'machine_id') machine: Relation<Machine>;
}
