import { Model, Query } from "@nozbe/watermelondb";
import { children, date, field, readonly, text } from "@nozbe/watermelondb/decorators";
import type MachineChangeGear from "./MachineChangeGear";
import type ProductionSetup from "./ProductionSetup";

export default class Machine extends Model {
    static table = "machines";

    static associations = {
        machine_change_gears: { type: "has_many" as const, foreignKey: "machine_id" },
        production_setups: { type: "has_many" as const, foreignKey: "machine_id" },
    };

    @text("name") name: string;
    @field("indexing_ratio") indexingRatio: number;
    @field("feed_constant") feedConstant: number;
    @field("is_active") isActive: boolean;
    @readonly @date("created_at") createdAt: Date;

    @children("machine_change_gears") changeGears: Query<MachineChangeGear>;
    @children("production_setups") productionSetups: Query<ProductionSetup>;
}
