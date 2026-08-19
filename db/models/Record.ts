import { Model, Relation } from "@nozbe/watermelondb";
import { date, field, readonly, relation, text } from "@nozbe/watermelondb/decorators";
import type Machine from "./Machine";
import type Product from "./Product";

export default class Record extends Model {
    static table = "records";

    static associations = {
        products: { type: "belongs_to" as const, key: "product_id" },
        machines: { type: "belongs_to" as const, key: "machine_id" },
    };

    @text("product_id") productId: string;
    @text("machine_id") machineId: string;
    @field("quantity_cut") quantityCut: number;
    @field("rate_per_pc") ratePerPc: number;
    @field("total_money") totalMoney: number;
    
    @field("gear_a") gearA: number;
    @field("gear_b") gearB: number;
    @field("gear_c") gearC: number;
    @field("gear_d") gearD: number;

    @readonly @date("created_at") createdAt: Date;

    @relation("products", "product_id") product: Relation<Product>;
    @relation("machines", "machine_id") machine: Relation<Machine>;
}
