import { Buffer } from "node:buffer";
import { Service, connect, utils } from "@sap/cds";
import crypto from "crypto";

const normalizeText = (value?: string): string => (value || "").trim().toLowerCase().replace(/\s+/g, " ");

const toBuffer = (content: unknown): Buffer => {
    if (Buffer.isBuffer(content)) return content;
    if (typeof content === "string") {
        const base64 = content.includes(",") ? content.split(",").pop() as string : content;
        return Buffer.from(base64, "base64");
    }
    return Buffer.alloc(0);
};

const checksum = (content: Buffer): string => crypto.createHash("sha256").update(content).digest("hex");

const MOCK_MAP: Record<string, string> = {
    employee: "EMP2",
    manager: "EMP1",
    admin: "EMP3",
    auditor: "EMP10"
};

const getCurrentEmployee = async (userId: string): Promise<any> => {
    const db: Service = await connect.to("db");
    const { Employees } = db.entities;
    const mappedID = MOCK_MAP[userId];
    let employee = null;

    if (mappedID) {
        employee = await db.run(SELECT.one.from(Employees).where({ ID: mappedID }));
    }
    if (!employee) {
        employee = await db.run(SELECT.one.from(Employees).where({ email: userId }));
    }
    if (!employee) {
        employee = await db.run(SELECT.one.from(Employees).where({ ID: userId }));
    }
    if (!employee) {
        const ID = userId.includes("@") ? userId : (mappedID || utils.uuid());
        const email = userId.includes("@") ? userId : `${userId}@local.user`;
        const firstName = userId.charAt(0).toUpperCase() + userId.slice(1);
        await db.run(INSERT.into(Employees).entries({ ID, firstName, lastName: "User", email, isActive: true }));
        employee = await db.run(SELECT.one.from(Employees).where({ ID }));
    }
    return employee;
};

const recordAudit = async (actorEmployeeID: string, action: string, entityName: string, entityID: string): Promise<void> => {
    const db: Service = await connect.to("db");
    const { AuditEvents } = db.entities;
    await db.run(INSERT.into(AuditEvents).entries({ ID: utils.uuid(), actorEmployeeID, action, entityName, entityID, occurredAt: new Date().toISOString() }));
};

export { checksum, getCurrentEmployee, normalizeText, recordAudit, toBuffer };

