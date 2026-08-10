import { Model, Query } from "@nozbe/watermelondb";
import { children, text } from "@nozbe/watermelondb/decorators";
import type Order from "./Order";

export default class Customer extends Model {
    static table = "customers";

    static associations = {
        orders: { type: "has_many" as const, foreignKey: "customer_id" },
    };

    @text("name") name: string;
    @text("phone_number") phoneNumber: string;
    @text("business_address") businessAddress: string;

    @children("orders") orders: Query<Order>;
}
