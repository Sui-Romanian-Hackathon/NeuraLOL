// Fisier: sources/neuralol.move

module my_package::neuralol;

use sui::coin::{TreasuryCap, mint_and_transfer};
use sui::coin_registry;
use sui::object;
use sui::transfer;
use sui::tx_context::TxContext;

// Tipul de bază al monedei.
public struct NEURALOL has drop {}

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

    // Transferăm TreasuryCap și MetadataCap către adresa care a publicat modulul (portofelul tău).
    transfer::public_transfer(treasury_cap, ctx.sender());
    transfer::public_transfer(metadata_cap, ctx.sender());
}

// --- Funcția de Minting (Pentru a Crea Tokeni Noi) ---

/// Creează o cantitate specifică de NeuraLOL și îi trimite la adresa apelantului.
/// Poate fi apelată doar de cel care deține obiectul TreasuryCap.
public entry fun mint_to_self(cap: &mut TreasuryCap<NEURALOL>, amount: u64, ctx: &mut TxContext) {
    // Minting-ul se face și tokenii sunt transferați la adresa apelatorului (ctx.sender()).
    mint_and_transfer(cap, amount, ctx.sender(), ctx);
}

/// Mintuiește tokeni NeuraLOL și îi trimite către un wallet specific.
public entry fun mint_and_send(
    cap: &mut TreasuryCap<NEURALOL>, // TreasuryCap-ul tău
    amount: u64, // Cantitatea de tokeni de creat
    recipient: address, // Adresa destinatarului
    ctx: &mut TxContext,
) {
    // Mint-uiește tokenii și trimite direct la wallet-ul recipientului
    mint_and_transfer(cap, amount, recipient, ctx);
}
