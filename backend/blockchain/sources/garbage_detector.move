module garbage::garbage_detector {

    use std::string;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};

    /// Struct care ține hash + verdict
    struct DetectionReport has key, store {
        id: UID,
        image_hash: string::String,
        result: string::String,
    }

    /// Creează un nou obiect DetectionReport pe blockchain
    public entry fun store_detection(
        image_hash: string::String,
        result: string::String,
        ctx: &mut TxContext
    ) {
        let report = DetectionReport {
            id: object::new(ctx),
            image_hash,
            result
        };
        // Publicăm obiectul
        object::share_object(report);
    }
}
