module 0x0::garbagetracker;

use std::vector;
use sui::object::{UID, new};
use sui::tx_context::TxContext;

public struct Upload has store {
    wallet: address,
    timestamp: u64,
    lat: u64,
    lng: u64,
    ml_result: bool,
}

public struct Tracker has key {
    id: UID,
    uploads: vector<Upload>,
}

// Crează Tracker (fără entry!)
public fun init_tracker(ctx: &mut TxContext): Tracker {
    Tracker {
        id: new(ctx),
        uploads: vector::empty<Upload>(),
    }
}

// Adaugă upload la Tracker
public fun create_upload(
    tracker: &mut Tracker,
    wallet: address,
    timestamp: u64,
    lat: u64,
    lng: u64,
    ml_result: bool,
) {
    let upload = Upload {
        wallet,
        timestamp,
        lat,
        lng,
        ml_result,
    };
    vector::push_back(&mut tracker.uploads, upload);
}
