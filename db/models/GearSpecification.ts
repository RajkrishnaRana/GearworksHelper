import { Model, Query, Relation } from "@nozbe/watermelondb";
import { children, field, relation, text } from "@nozbe/watermelondb/decorators";
import type Order from "./Order";
import type ProductionSetup from "./ProductionSetup";

export default class GearSpecification extends Model {
    static table = "gear_specifications";

    static associations = {
        orders: { type: "belongs_to" as const, key: "order_id" },
        production_setups: { type: "has_many" as const, foreignKey: "spec_id" },
    };

    @text("order_id") orderId: string;
    @field("version_number") versionNumber: number;
    @field("is_current_version") isCurrentVersion: boolean;
    @text("gear_type") gearType: string;
    @field("module_or_dp") moduleOrDp: number;
    @field("teeth_count") teethCount: number;
    @field("helix_angle") helixAngle: number;
    @field("pitch") pitch?: number;
    @field("calculated_od") calculatedOd: number;
    @field("face_width") faceWidth?: number;
    @field("pressure_angle") pressureAngle?: number;
    @text("hand") hand?: string;

    @relation("orders", "order_id") order: Relation<Order>;
    @children("production_setups") productionSetups: Query<ProductionSetup>;
}
