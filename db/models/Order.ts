import { Model, Query, Relation } from "@nozbe/watermelondb";
import { children, date, field, readonly, relation, text } from "@nozbe/watermelondb/decorators";
import type Customer from "./Customer";
import type Product from "./Product";
import type GearSpecification from "./GearSpecification";
import type WormWheelSpecification from "./WormWheelSpecification";
import type ProductionSetup from "./ProductionSetup";

export default class Order extends Model {
    static table = "orders";

    static associations = {
        customers: { type: "belongs_to" as const, key: "customer_id" },
        products: { type: "belongs_to" as const, key: "product_id" },
        gear_specifications: { type: "has_many" as const, foreignKey: "order_id" },
        worm_wheel_specifications: { type: "has_many" as const, foreignKey: "order_id" },
        production_setups: { type: "has_many" as const, foreignKey: "order_id" },
    };

    @text("customer_id") customerId: string;
    @text("product_id") productId?: string;
    @text("order_status") orderStatus: string;
    @field("quoted_rate_per_pc") quotedRatePerPc: number;
    @field("final_rate_per_pc") finalRatePerPc: number;
    @text("bargain_note") bargainNote?: string;
    @field("total_agreed_amount") totalAgreedAmount: number;
    @date("delivery_deadline") deliveryDeadline: Date;
    @readonly @date("created_at") createdAt: Date;

    @relation("customers", "customer_id") customer: Relation<Customer>;
    @relation("products", "product_id") product?: Relation<Product>;
    @children("gear_specifications") gearSpecifications: Query<GearSpecification>;
    @children("worm_wheel_specifications") wormWheelSpecifications: Query<WormWheelSpecification>;
    @children("production_setups") productionSetups: Query<ProductionSetup>;
}
