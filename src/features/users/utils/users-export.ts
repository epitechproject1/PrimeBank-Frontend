import type { User } from "../types/user.type";
import { formatDate, roleLabel } from "./users-constants";

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function buildRows(users: User[]) {
    return users.map((u) => [
        u.first_name,
        u.last_name,
        u.email,
        u.phone_number || "--",
        roleLabel(u.role),
        u.is_active ? "Actif" : "Inactif",
        formatDate(u.created_at),
    ]);
}

export function exportUsersCsv(users: User[]) {
    const headers = [
        "Prenom",
        "Nom",
        "Email",
        "Telephone",
        "Role",
        "Statut",
        "Cree le",
    ];
    const rows = buildRows(users);
    const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, "users.csv");
}

function buildHtmlTable(users: User[]) {
    const rows = buildRows(users)
        .map(
            (r) =>
                `<tr>${r.map((c) => `<td>${String(c)}</td>`).join("")}</tr>`
        )
        .join("");

    return `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Export Users</title>
<style>
body { font-family: Arial, sans-serif; padding: 16px; }
h2 { margin: 0 0 12px; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background: #f5f5f5; }
</style>
</head>
<body>
<h2>Utilisateurs</h2>
<table>
<thead>
<tr>
<th>Prenom</th>
<th>Nom</th>
<th>Email</th>
<th>Telephone</th>
<th>Role</th>
<th>Statut</th>
<th>Cree le</th>
</tr>
</thead>
<tbody>
${rows}
</tbody>
</table>
</body>
</html>`;
}

export function exportUsersWord(users: User[]) {
    const html = buildHtmlTable(users);
    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    downloadBlob(blob, "users.doc");
}

export function exportUsersPdf(users: User[]) {
    const html = buildHtmlTable(users);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
}
