import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';
import type Cutter from './Cutter';

export default class CutterMaintenanceLog extends Model {
  static table = 'cutter_maintenance_logs';

  static associations = {
    cutters: { type: 'belongs_to' as const, key: 'cutter_id' },
  };

  @text('cutter_id') cutterId: string;
  @text('event_type') eventType: string;
  @field('diameter_after_grind') diameterAfterGrind: number;
  @text('notes') notes?: string;
  @readonly @date('created_at') createdAt: Date;

  @relation('cutters', 'cutter_id') cutter: Relation<Cutter>;
}
