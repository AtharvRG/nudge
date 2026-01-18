
import { createRpc } from "@lightprotocol/stateless.js";
import dotenv from "dotenv";
import path from "path";

// Load env from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testConnection() {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

    if (!rpcUrl) {
        process.exit(1);
    }

    try {
        const connection = createRpc(rpcUrl, rpcUrl, rpcUrl);

        await connection.getSlot();

        await connection.getIndexerHealth();
    } catch (error) {
        void error;
    }
}

testConnection();
