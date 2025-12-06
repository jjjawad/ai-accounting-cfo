import { FileUploadRequestSchema } from "../lib/validation/file-schema";

const validPayload = {
  company_id: "company_1",
  type: "invoice",
};

const invalidPayload = {
  company_id: "",
  type: "not-a-valid-type",
};

console.log("Valid payload result:", FileUploadRequestSchema.safeParse(validPayload));
console.log("Invalid payload result:", FileUploadRequestSchema.safeParse(invalidPayload));
