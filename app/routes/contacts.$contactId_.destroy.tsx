import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { deleteContact } from "~/data";

export const action = async ({
  params
 }: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId parameter");
  
  await deleteContact(params.contactId);

  return redirect("/")

 }