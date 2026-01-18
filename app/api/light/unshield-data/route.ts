
import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { getLightConnection, NudgeError } from "@/lib/light";
import {
    LightSystemProgram,
    selectMinCompressedSolAccountsForTransfer,
    selectStateTreeInfo,
    bn
} from "@lightprotocol/stateless.js";
import BN from "bn.js";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { stealthPublicKey, recipientPublicKey, feePayer } = body;

        if (!stealthPublicKey || !recipientPublicKey || !feePayer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const stealthPubkey = new PublicKey(stealthPublicKey);
        const recipientPubkey = new PublicKey(recipientPublicKey);
        const feePayerPubkey = new PublicKey(feePayer);

        const connection = getLightConnection();

        // 1. Fetch compressed accounts
        const accountsFn = await connection.getCompressedAccountsByOwner(stealthPubkey);
        const allAccounts = accountsFn.items || [];

        if (allAccounts.length === 0) {
            return NextResponse.json({ error: "No shielded funds found" }, { status: 404 });
        }

        // 2. Calculate balance and select accounts
        let totalLamports = new BN(0);
        for (const account of allAccounts) {
            if (account.lamports) {
                totalLamports = totalLamports.add(new BN(account.lamports));
            }
        }

        if (totalLamports.isZero()) {
            return NextResponse.json({ error: "Balance is zero" }, { status: 404 });
        }

        const [selectedAccounts, _] = selectMinCompressedSolAccountsForTransfer(
            allAccounts,
            totalLamports
        );

        // 3. Get Validity Proof
        const accountHashes = selectedAccounts.map((acc) => bn(acc.hash));
        const proofResult = await connection.getValidityProof(
            accountHashes,
            []
        );

        // 4. Return the data needed to build the instruction on the client
        // We return the raw data so the client can reconstruct the objects
        return NextResponse.json({
            selectedAccounts,
            totalLamports: totalLamports.toString(),
            rootIndices: proofResult.rootIndices,
            compressedProof: proofResult.compressedProof,
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch unshield data" },
            { status: 500 }
        );
    }
}
