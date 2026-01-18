import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST() {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // 1. Find links to delete
        const { data: linksToDelete, error: fetchError } = await supabaseAdmin
            .from("links")
            .select("id")
            .lt("created_at", oneWeekAgo.toISOString());

        if (fetchError) {
            throw fetchError;
        }

        const linkIds = linksToDelete?.map(l => l.id) || [];

        if (linkIds.length > 0) {
            // 2. Unlink associated transactions
            const { error: unlinkError } = await supabaseAdmin
                .from("transactions")
                .update({ link_id: null })
                .in("link_id", linkIds);

            if (unlinkError) {
                return NextResponse.json({ error: unlinkError.message }, { status: 500 });
            }

            // 3. Delete the links
            const { error: deleteError, count } = await supabaseAdmin
                .from("links")
                .delete()
                .in("id", linkIds)
                .select("id");

            if (deleteError) {
                return NextResponse.json({ error: deleteError.message }, { status: 500 });
            }

            return NextResponse.json({ ok: true, deleted: count || 0, unlinked: linkIds.length });
        }

        return NextResponse.json({ ok: true, deleted: 0 });

    } catch (err: any) {
        return NextResponse.json({
            error: "Cleanup failed"
        }, { status: 500 });
    }
}
