import { Model } from "@nozbe/watermelondb";
import { date, field, readonly, text } from "@nozbe/watermelondb/decorators";

export default class Product extends Model {
    static table = "products";

    @text("customer_name") customerName: string;
    @text("product_name") productName: string;
    @field("total_quantity") totalQuantity: number;
    @field("dispatched_quantity") dispatchedQuantity: number;
    @field("rate") rate?: number;
    @date("created_at") createdAt: Date;
}
