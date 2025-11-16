module my_package::neuralol;

use sui::coin::{Self, TreasuryCap, mint_and_transfer};
use sui::coin_registry;
use sui::object::{Self, UID};
use sui::table::{Self, Table};
use sui::transfer;
use sui::tx_context::{Self, TxContext};

// --- Tipuri de Bază ---

// Tipul de bază al monedei.
public struct NEURALOL has drop {}

// Obiectul de stare pentru a gestiona permisiunile de minting/primire.
// Acesta înlocuiește logica "hash-ului" cu o politică on-chain (whitelist).
public struct RecipientPolicy has key, store {
    id: UID,
    // Harta care stochează adresele permise (whitelist).
    // Cheia: adresa destinatarului; Valoarea: true (permis).
    whitelist: Table<address, bool>,
}

// --- Funcția de Inițializare (Se Rulează O Singură Dată la Publicare) ---
fun init(witness: NEURALOL, ctx: &mut TxContext) {
    let (builder, treasury_cap) = coin_registry::new_currency_with_otw(
        witness,
        6, // Decimals: 6
        b"NEURALOL".to_string(), // Symbol
        b"NeuraLOL".to_string(), // Name
        b"Tokenul oficial NeuraLOL".to_string(), // Description
        b"https://example.com/neuralol.png".to_string(), // Icon URL
        ctx,
    );

    let metadata_cap = builder.finalize(ctx);

    // 1. Creează obiectul de politică
    let policy = RecipientPolicy {
        id: object::new(ctx),
        whitelist: table::new(ctx),
    };

    // 2. Transferă toate obiectele esențiale către adresa care a publicat modulul.
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
    transfer::public_transfer(policy, ctx.sender());
}

// --- Funcții de Gestiune a WhiteList-ului (Politicii) ---

/// Adaugă o adresă pe "lista albă" (whitelist) din obiectul RecipientPolicy.
/// Poate fi apelată doar de cel care deține obiectul RecipientPolicy.
public entry fun add_to_whitelist(
    policy: &mut RecipientPolicy, // Policy objectul deținut de Mint Manager
    addr: address,
    _ctx: &mut TxContext,
) {
    // Verifică dacă adresa nu este deja în listă înainte de a adăuga.
    if (!table::contains(&policy.whitelist, addr)) {
        table::add(&mut policy.whitelist, addr, true);
    };
}

/// Șterge o adresă de pe "lista albă".
public entry fun remove_from_whitelist(
    policy: &mut RecipientPolicy,
    addr: address,
    _ctx: &mut TxContext,
) {
    // Șterge doar dacă adresa este deja în listă.
    if (table::contains(&policy.whitelist, addr)) {
        table::remove(&mut policy.whitelist, addr);
    };
}

// --- Funcții de Minting (Pentru a Crea Tokeni Noi) ---

// NOTĂ: Funcția mint_to_self nu este modificată, deoarece
// tokenii sunt transferați apelantului (ctx.sender()), care este
// presupus a fi de încredere (deținătorul TreasuryCap).
public entry fun mint_to_self(cap: &mut TreasuryCap<NEURALOL>, amount: u64, ctx: &mut TxContext) {
    mint_and_transfer(cap, amount, ctx.sender(), ctx);
}

/// Mintuiește tokeni NeuraLOL și îi trimite către un wallet specific.
/// Transferul este validat doar dacă adresa destinatarului se află pe whitelist.
public entry fun mint_and_send(
    cap: &mut TreasuryCap<NEURALOL>, // TreasuryCap-ul tău
    policy: &RecipientPolicy, // Obiectul Policy pentru verificare
    amount: u64, // Cantitatea de tokeni de creat
    recipient: address, // Adresa destinatarului
    ctx: &mut TxContext,
) {
    // **VALIDAREA**:
    // Tranzacția va eșua dacă adresa destinatarului NU este în whitelist.
    // Am înlocuit codul de eroare invalid cu un literal u64 (42).
    assert!(table::contains(&policy.whitelist, recipient), 42);

    // Dacă validarea a trecut, se execută minting-ul și transferul
    mint_and_transfer(cap, amount, recipient, ctx);
}
