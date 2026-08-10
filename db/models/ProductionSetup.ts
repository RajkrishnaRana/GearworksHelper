import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';
import type Cutter from './Cutter';
import type GearSpecification from './GearSpecification';
import type Machine from './Machine';

export default class ProductionSetup extends Model {
  static table = 'production_setups';

  static associations = {
    machines: { type: 'belongs_to' as const, key: 'machine_id' },
    gear_specifications: { type: 'belongs_to' as const, key: 'spec_id' },
    cutters: { type: 'belongs_to' as const, key: 'cutter_id' },
  };

  @text('machine_id') machineId: string;
  @text('spec_id') specId: string;
  @text('cutter_id') cutterId: string;
  @field('gear_a') gearA: number;
  @field('gear_b') gearB: number;
  @field('gear_c') gearC: number;
  @field('gear_d') gearD: number;
  @text('status') status: string;
  @field('sequence_order') sequenceOrder: number;
  @field('quantity') quantity?: number;
  @text('operator_notes') operatorNotes?: string;
  @readonly @date('created_at') createdAt: Date;

  @relation('machines', 'machine_id') machine: Relation<Machine>;
  @relation('gear_specifications', 'spec_id') gearSpecification: Relation<GearSpecification>;
  @relation('cutters', 'cutter_id') cutter: Relation<Cutter>;
}
