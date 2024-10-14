import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getContact, updateContact } from "~/data";


export const loader = async ({params}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId parameter");
  const contact = await getContact(params.contactId);
  if(!contact) throw new Response("Not Found", {status: 404});
  return json({contact});
}


export const action = async ({params, request}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId parameter");
  const formData = await request.formData();
  
  // const firstName = formData.get("first");
  // const lastName = formData.get("last");
  // instead of getting each value individually, we can get all the values at once
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}

export default function EditContact() {

  const { contact } = useLoaderData<typeof loader>();

  return(
    <Form key={contact.id} id="contact-form" method="POST">
      <p>
        <span>Name</span>
        <input
          aria-label="First Name"
          defaultValue={contact.first}
          name="first"
          placeholder="First Name"
          type="text"
        />
        <input
          aria-label="Last Name"
          defaultValue={contact.first}
          name="last"
          placeholder="Last Name"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </p>
    </Form>
  );


}