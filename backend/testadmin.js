// Check if admin token fetches data 
const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();
const jwt = require('./node_modules/jsonwebtoken');

async function testAdmin() {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) {
        console.log("No admin found in DB!");
        return;
    }
    const token = jwt.sign({ sub: admin.id, email: admin.email, role: admin.role }, 'fallback_secret_for_dev_only');
    const res = await fetch("http://localhost:3001/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data length:", data.length);
    if (res.status !== 200) console.log(data);

    // check ecommerce
    const prodRes = await fetch("http://localhost:3001/admin/products", {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Products Status:", prodRes.status);
    console.log("Products:", await prodRes.json());

    // check KPIs
    const kpiRes = await fetch("http://localhost:3001/admin/kpis", {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log("KPI Status:", kpiRes.status);
    console.log("KPIs:", await kpiRes.json());
}
testAdmin().finally(() => prisma.$disconnect());
