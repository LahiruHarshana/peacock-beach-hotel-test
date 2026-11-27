import "server-only";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/client";
import { COLLECTIONS } from "@/lib/db/collections";
import { type UserRole } from "@/lib/auth/roles";

export type StaffRecord = {
  _id: ObjectId;
  emailNormalized: string;
  name?: string;
  role: UserRole;
  status: string;
  tokenVersion?: number;
};

export async function findStaffById(id: string): Promise<StaffRecord | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<StaffRecord>(COLLECTIONS.users).findOne(
    { _id: new ObjectId(id) },
    { projection: { emailNormalized: 1, name: 1, role: 1, status: 1, tokenVersion: 1 } },
  );
}
