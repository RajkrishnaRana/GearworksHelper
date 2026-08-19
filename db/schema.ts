import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "machines",
            columns: [
                { name: "name", type: "string" },
                { name: "indexing_ratio", type: "number" },
                { name: "differential_constant", type: "number" },
                { name: "status", type: "string" },
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
                { name: "cutter_name", type: "string" },
                { name: "angle", type: "string" },
                { name: "hand", type: "string" },
                { name: "pitch", type: "number" },
                { name: "bore", type: "number" },
                { name: "deep", type: "number" },
                { name: "starts", type: "number" },
                { name: "pressure_angle", type: "number" },
                { name: "cutter_type", type: "string" },
                { name: "diameter", type: "number" },
                { name: "notes", type: "string" },
                { name: "created_at", type: "number" },
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
                { name: "gear_a", type: "number" },
                { name: "gear_b", type: "number" },
                { name: "gear_c", type: "number" },
                { name: "gear_d", type: "number" },
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
                { name: "product_id", type: "string", isIndexed: true, isOptional: true },
                { name: "order_status", type: "string" }, // quoted, confirmed, in_production, completed, delivered
                { name: "quoted_rate_per_pc", type: "number" },
                { name: "final_rate_per_pc", type: "number" },
                { name: "bargain_note", type: "string", isOptional: true },
                { name: "total_agreed_amount", type: "number" },
                { name: "delivery_deadline", type: "number", isOptional: true },
                { name: "created_at", type: "number", isIndexed: true },
            ],
        }),
        tableSchema({
            name: "gear_specifications",
            columns: [
                { name: "order_id", type: "string", isIndexed: true },
                { name: "version_number", type: "number" },
                { name: "is_current_version", type: "boolean" },
                { name: "gear_type", type: "string" }, // straight, helix, pinion
                { name: "module_or_dp", type: "string" }, // stores 'module' or 'dp'
                { name: "cutter_number", type: "number" }, // stores 3.5, 8, etc.
                { name: "teeth_count", type: "number" },
                { name: "helix_angle", type: "string" },
                { name: "calculated_od", type: "number" },
                { name: "out_dia", type: "number", isOptional: true },
                { name: "face_width", type: "number", isOptional: true },
                { name: "hand", type: "string", isOptional: true },
                { name: "notes", type: "string", isOptional: true },
            ],
        }),
        tableSchema({
            name: "worm_wheel_specifications",
            columns: [
                { name: "order_id", type: "string", isIndexed: true },
                { name: "version_number", type: "number" },
                { name: "is_current_version", type: "boolean" },
                { name: "out_dia", type: "number" },
                { name: "throat_dia", type: "number" },
                { name: "pitch", type: "number", isOptional: true },
                { name: "module_or_dp", type: "string" }, // 'module' or 'dp'
                { name: "cutter_number", type: "number" }, // 3.5, 8, etc.
                { name: "starts", type: "number" }, // start of cutter
                { name: "worm_dia", type: "number" },
                { name: "teeth_count", type: "number" },
                { name: "wheel_angle", type: "string" }, // degrees/minutes
                { name: "hand", type: "string", isOptional: true },
                { name: "notes", type: "string", isOptional: true },
            ],
        }),
        tableSchema({
            name: "production_setups",
            columns: [
                { name: "machine_id", type: "string", isIndexed: true },
                { name: "order_id", type: "string", isIndexed: true },
                { name: "cutter_id", type: "string", isIndexed: true },
                { name: "gear_a", type: "number" },
                { name: "gear_b", type: "number" },
                { name: "gear_c", type: "number" },
                { name: "gear_d", type: "number" },
                { name: "status", type: "string" }, // queued, in_setup, running, completed
                { name: "sequence_order", type: "number" },
                { name: "quantity", type: "number", isOptional: true },
                { name: "operator_notes", type: "string", isOptional: true },
                { name: "created_at", type: "number" },
            ],
        }),
        tableSchema({
            name: "products",
            columns: [
                { name: "customer_name", type: "string" },
                { name: "product_name", type: "string" },
                { name: "total_quantity", type: "number" },
                { name: "dispatched_quantity", type: "number" },
                { name: "rate", type: "number", isOptional: true },
                { name: "created_at", type: "number" },
            ],
        }),
        tableSchema({
            name: "records",
            columns: [
                { name: "product_id", type: "string", isIndexed: true },
                { name: "machine_id", type: "string", isIndexed: true },
                { name: "quantity_cut", type: "number" },
                { name: "rate_per_pc", type: "number" },
                { name: "total_money", type: "number" },
                { name: "gear_a", type: "number", isOptional: true },
                { name: "gear_b", type: "number", isOptional: true },
                { name: "gear_c", type: "number", isOptional: true },
                { name: "gear_d", type: "number", isOptional: true },
                { name: "created_at", type: "number" },
            ],
        }),
    ],
});
