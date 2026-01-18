
import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { getLightConnection, NudgeError } from "@/lib/light";
import BN from "bn.js";

// Re-implement balance fetching logic server-side to avoid CORS
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { publicKey } = body;

        if (!publicKey) {
            return NextResponse.json({ error: "Public key is required" }, { status: 400 });
        }

        const stealthPublicKey = new PublicKey(publicKey);
        const connection = getLightConnection();

        // 1. Fetch compressed accounts
        const result = await connection.getCompressedAccountsByOwner(stealthPublicKey);
        const accounts = result.items || [];

        // 2. Sum lamports
        let totalLamports = new BN(0);
        for (const account of accounts) {
            if (account.lamports) {
                totalLamports = totalLamports.add(new BN(account.lamports));
            }
        }

        // 3. Convert to SOL
        const solBalance = parseFloat(totalLamports.toString()) / 1_000_000_000;

        return NextResponse.json({ balance: solBalance });

    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || "Failed to fetch balance"
            },
            { status: 500 }
        );
    }
}
