import { Model, Query, Relation } from "@nozbe/watermelondb";
import { children, date, field, relation, text } from "@nozbe/watermelondb/decorators";
import type Customer from "./Customer";
import type GearSpecification from "./GearSpecification";

export default class Order extends Model {
    static table = "orders";

    static associations = {
        customers: { type: "belongs_to" as const, key: "customer_id" },
        gear_specifications: { type: "has_many" as const, foreignKey: "order_id" },
    };

    @text("customer_id") customerId: string;
    @text("order_status") orderStatus: string;
    @field("quoted_rate_per_pc") quotedRatePerPc: number;
    @field("final_rate_per_pc") finalRatePerPc: number;
    @text("bargain_note") bargainNote?: string;
    @field("total_agreed_amount") totalAgreedAmount: number;
    @date("delivery_deadline") deliveryDeadline: Date;

    @relation("customers", "customer_id") customer: Relation<Customer>;
    @children("gear_specifications") gearSpecifications: Query<GearSpecification>;
}
