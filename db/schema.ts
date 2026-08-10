import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "machines",
            columns: [
                { name: "name", type: "string" },
                { name: "indexing_ratio", type: "number" },
                { name: "feed_constant", type: "number" },
                { name: "is_active", type: "boolean" },
                { name: "created_at", type: "number" },
            ],
        }),
        tableSchema({
            name: "machine_change_gears",
            columns: [
                { name: "machine_id", type: "string", isIndexed: true },
                { name: "teeth_count", type: "number" },
                { name: "quantity", type: "number" },
                { name: "status", type: "string" }, // idle, mounted, damaged
                { name: "is_universal", type: "boolean" },
            ],
        }),
        tableSchema({
            name: "cutters",
            columns: [
                { name: "cutter_type", type: "string" },
                { name: "module_or_dp", type: "number" },
                { name: "pressure_angle", type: "number" },
                { name: "angle", type: "number" },
                { name: "bore", type: "number" },
                { name: "diameter", type: "number", isOptional: true },
                { name: "material", type: "string", isOptional: true },
                { name: "current_status", type: "string" }, // sharp, dull, at_grind_shop
                { name: "usage_count", type: "number" },
            ],
        }),
        tableSchema({
            name: "cutter_maintenance_logs",
            columns: [
                { name: "cutter_id", type: "string", isIndexed: true },
                { name: "event_type", type: "string" }, // sharpened, marked_dull, sent_to_grind_shop
                { name: "diameter_after_grind", type: "number" },
                { name: "notes", type: "string", isOptional: true },
                { name: "created_at", type: "number" },
            ],
        }),
        tableSchema({
            name: "ratio_lookup_cache",
            columns: [
                { name: "machine_id", type: "string", isIndexed: true },
                { name: "teeth_count", type: "number", isIndexed: true },
                { name: "helix_angle", type: "number", isIndexed: true },
                { name: "module_or_dp", type: "number" },
                { name: "gear_abcd_json", type: "string" }, // Saved working gear-train combination
                { name: "calculation_precision", type: "number" },
                { name: "last_used_at", type: "number" },
            ],
        }),
        tableSchema({
            name: "customers",
            columns: [
                { name: "name", type: "string", isIndexed: true },
                { name: "phone_number", type: "string" },
                { name: "business_address", type: "string" },
            ],
        }),
        tableSchema({
            name: "orders",
            columns: [
                { name: "customer_id", type: "string", isIndexed: true },
                { name: "order_status", type: "string" }, // quoted, confirmed, in_production, completed, delivered
                { name: "quoted_rate_per_pc", type: "number" },
                { name: "final_rate_per_pc", type: "number" },
                { name: "bargain_note", type: "string", isOptional: true },
                { name: "total_agreed_amount", type: "number" },
                { name: "delivery_deadline", type: "number" },
            ],
        }),
        tableSchema({
            name: "gear_specifications",
            columns: [
                { name: "order_id", type: "string", isIndexed: true },
                { name: "version_number", type: "number" },
                { name: "is_current_version", type: "boolean" },
                { name: "gear_type", type: "string" }, // straight, helix, pinion, wheel
                { name: "module_or_dp", type: "number" },
                { name: "teeth_count", type: "number" },
                { name: "helix_angle", type: "number" },
                { name: "pitch", type: "number", isOptional: true },
                { name: "calculated_od", type: "number" },
            ],
        }),
        tableSchema({
            name: "production_setups",
            columns: [
                { name: "machine_id", type: "string", isIndexed: true },
                { name: "spec_id", type: "string", isIndexed: true },
                { name: "cutter_id", type: "string", isIndexed: true },
                { name: "gear_settings_abcd", type: "string" }, // Realized gear train matching schema
                { name: "operator_notes", type: "string", isOptional: true },
                { name: "created_at", type: "number" },
            ],
        }),
    ],
});
