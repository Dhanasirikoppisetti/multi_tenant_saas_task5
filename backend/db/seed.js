const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // =========================
  // SUPER ADMIN (SYSTEM)
  // =========================
  const superAdminEmail = "superadmin@system.com";
  const superAdminPassword = await bcrypt.hash("Admin@123", 10);

  const superAdmin = await prisma.user.findFirst({
    where: {
      email: superAdminEmail,
      tenantId: null,
    },
  });

  if (!superAdmin) {
    await prisma.user.create({
      data: {
        email: superAdminEmail,
        passwordHash: superAdminPassword,
        fullName: "System Super Admin",
        role: "super_admin",
        tenantId: null,
      },
    });
    console.log("✅ Super admin created");
  } else {
    console.log("ℹ️ Super admin already exists");
  }

  // =========================
  // TENANT
  // =========================
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: "demo" },
    update: {},
    create: {
      name: "Demo Company",
      subdomain: "demo",
      status: "active",
      subscriptionPlan: "pro",
      maxUsers: 25,
      maxProjects: 15,
    },
  });

  console.log("✅ Tenant ready");

  // =========================
  // TENANT ADMIN
  // =========================
  const adminEmail = "admin@demo.com";
  const adminPassword = await bcrypt.hash("Demo@123", 10);

  let admin = await prisma.user.findFirst({
    where: {
      email: adminEmail,
      tenantId: tenant.id,
    },
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: adminPassword,
        fullName: "Demo Admin",
        role: "tenant_admin",
        tenantId: tenant.id,
      },
    });
    console.log("✅ Tenant admin created");
  } else {
    console.log("ℹ️ Tenant admin already exists");
  }

  // =========================
  // USERS
  // =========================
  const userPassword = await bcrypt.hash("User@123", 10);

  const users = [
    { email: "user1@demo.com", name: "User One" },
    { email: "user2@demo.com", name: "User Two" },
  ];

  for (const u of users) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: u.email,
        tenantId: tenant.id,
      },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: u.email,
          passwordHash: userPassword,
          fullName: u.name,
          role: "user",
          tenantId: tenant.id,
        },
      });
      console.log(`✅ ${u.email} created`);
    }
  }

  // =========================
  // PROJECTS
  // =========================
 // =========================
// PROJECTS
// =========================
let projectAlpha = await prisma.project.findFirst({
  where: {
    name: "Project Alpha",
    tenantId: tenant.id,
  },
});

if (!projectAlpha) {
  projectAlpha = await prisma.project.create({
    data: {
      name: "Project Alpha",
      status: "active",
      tenantId: tenant.id,
      createdById: admin.id,
    },
  });
  console.log("✅ Project Alpha created");
} else {
  console.log("ℹ️ Project Alpha already exists");
}

let projectBeta = await prisma.project.findFirst({
  where: {
    name: "Project Beta",
    tenantId: tenant.id,
  },
});

if (!projectBeta) {
  projectBeta = await prisma.project.create({
    data: {
      name: "Project Beta",
      status: "active",
      tenantId: tenant.id,
      createdById: admin.id,
    },
  });
  console.log("✅ Project Beta created");
} else {
  console.log("ℹ️ Project Beta already exists");
}


  // =========================
  // TASKS
  // =========================
  const tasks = [
    { title: "Task 1", projectId: projectAlpha.id },
    { title: "Task 2", projectId: projectAlpha.id },
    { title: "Task 3", projectId: projectBeta.id },
    { title: "Task 4", projectId: projectBeta.id },
    { title: "Task 5", projectId: projectBeta.id },
  ];

  for (const task of tasks) {
    const exists = await prisma.task.findFirst({
      where: {
        title: task.title,
        projectId: task.projectId,
        tenantId: tenant.id,
      },
    });

    if (!exists) {
      await prisma.task.create({
        data: {
          title: task.title,
          tenantId: tenant.id,
          projectId: task.projectId,
        },
      });
    }
  }

  console.log("🎉 Database seeded successfully");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
