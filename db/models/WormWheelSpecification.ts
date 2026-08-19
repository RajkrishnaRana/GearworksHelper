import { Model, Relation } from "@nozbe/watermelondb";
import { field, relation, text } from "@nozbe/watermelondb/decorators";
import type Order from "./Order";

export default class WormWheelSpecification extends Model {
    static table = "worm_wheel_specifications";

    static associations = {
        orders: { type: "belongs_to" as const, key: "order_id" },
    };

    @text("order_id") orderId: string;
    @field("version_number") versionNumber: number;
    @field("is_current_version") isCurrentVersion: boolean;
    @field("out_dia") outDia: number;
    @field("throat_dia") throatDia: number;
    @field("pitch") pitch?: number;
    @text("module_or_dp") moduleOrDp: string;
    @field("cutter_number") cutterNumber: number;
    @field("starts") starts: number;
    @field("worm_dia") wormDia: number;
    @field("teeth_count") teethCount: number;
    @text("wheel_angle") wheelAngle: string;
    @text("hand") hand?: string;
    @text("notes") notes?: string;

    @relation("orders", "order_id") order: Relation<Order>;
}
