import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const sourceDir = `C:\\Users\\adr\\.gemini\\antigravity\\brain\\4a6ec73d-6ea4-44ef-8558-c8f54540b01a`;
        const destDir = `c:\\Users\\adr\\Desktop\\AIbot\\Senpai\\public\\avatars`;

        const files = [
            { src: "professional_avatar_1_1773638294235.png", dest: "avatar1.png" },
            { src: "professional_avatar_2_1773638310292.png", dest: "avatar2.png" },
            { src: "professional_avatar_3_1773638324074.png", dest: "avatar3.png" },
        ];

        for (const file of files) {
            const srcPath = path.join(sourceDir, file.src);
            const destPath = path.join(destDir, file.dest);
            fs.copyFileSync(srcPath, destPath);
        }

        return NextResponse.json({ success: true, message: "Avatars deployed successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
