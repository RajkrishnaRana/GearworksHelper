import { Model, Query } from "@nozbe/watermelondb";
import { children, field, text } from "@nozbe/watermelondb/decorators";
import type CutterMaintenanceLog from "./CutterMaintenanceLog";
import type ProductionSetup from "./ProductionSetup";

export default class Cutter extends Model {
    static table = "cutters";

    static associations = {
        cutter_maintenance_logs: { type: "has_many" as const, foreignKey: "cutter_id" },
        production_setups: { type: "has_many" as const, foreignKey: "cutter_id" },
    };

    @text("cutter_name") cutterName: string;
    @text("angle") angle: string;
    @text("hand") hand: string;
    @field("pitch") pitch: number;
    @field("bore") bore: number;
    @field("deep") deep: number;
    @field("starts") starts: number;
    @field("pressure_angle") pressureAngle: number;
    @text("cutter_type") cutterType: string;
    @field("diameter") diameter?: number;
    @text("notes") notes?: string;
    @field("created_at") createdAt: number;

    @children("cutter_maintenance_logs") maintenanceLogs: Query<CutterMaintenanceLog>;
    @children("production_setups") productionSetups: Query<ProductionSetup>;
}
