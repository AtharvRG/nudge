
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

        // 4. Return JSON-safe data for client reconstruction
        const serializedAccounts = selectedAccounts.map((acc) => ({
            owner: acc.owner?.toBase58(),
            lamports: acc.lamports?.toString(),
            address: acc.address ? new PublicKey(acc.address).toBase58() : null,
            data: acc.data
                ? {
                    discriminator: Array.from(acc.data.discriminator || []),
                    data: Array.from(acc.data.data || []),
                    dataHash: Array.from(acc.data.dataHash || []),
                }
                : null,
            hash: acc.hash ? Array.from(bn(acc.hash).toArray("be", 32)) : [],
            leafIndex: acc.leafIndex,
            proveByIndex: acc.proveByIndex ?? false,
            treeInfo: acc.treeInfo
                ? {
                    tree: acc.treeInfo.tree?.toBase58(),
                    queue: acc.treeInfo.queue?.toBase58(),
                    cpiContext: acc.treeInfo.cpiContext?.toBase58() ?? null,
                    treeType: acc.treeInfo.treeType,
                    nextTreeInfo: acc.treeInfo.nextTreeInfo
                        ? {
                            tree: acc.treeInfo.nextTreeInfo.tree?.toBase58(),
                            queue: acc.treeInfo.nextTreeInfo.queue?.toBase58(),
                            cpiContext: acc.treeInfo.nextTreeInfo.cpiContext?.toBase58() ?? null,
                            treeType: acc.treeInfo.nextTreeInfo.treeType,
                            nextTreeInfo: null,
                        }
                        : null,
                }
                : null,
        }));

        return NextResponse.json({
            selectedAccounts: serializedAccounts,
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
