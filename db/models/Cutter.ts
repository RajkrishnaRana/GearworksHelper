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

    @text("cutter_type") cutterType: string;
    @field("module_or_dp") moduleOrDp: number;
    @field("pressure_angle") pressureAngle: number;
    @field("angle") angle: number;
    @field("bore") bore: number;
    @field("diameter") diameter?: number;
    @text("material") material?: string;
    @text("current_status") currentStatus: string;
    @field("usage_count") usageCount: number;

    @children("cutter_maintenance_logs") maintenanceLogs: Query<CutterMaintenanceLog>;
    @children("production_setups") productionSetups: Query<ProductionSetup>;
}
