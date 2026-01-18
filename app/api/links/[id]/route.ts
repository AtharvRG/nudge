
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Bypass shared module to rule out initialization issues
const getAdminClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

    if (!key) throw new Error("Missing Service Role Key");

    return createClient(url, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    });
};

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Link ID is required" }, { status: 400 });
        }

        const supabase = getAdminClient();

        // 1. Delete the link (Transactions will be preserved via ON DELETE SET NULL)
        const { error: deleteError } = await supabase
            .from("links")
            .delete()
            .eq("id", id);

        if (deleteError) {
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        return NextResponse.json({
            error: "Delete failed"
        }, { status: 500 });
    }
}
