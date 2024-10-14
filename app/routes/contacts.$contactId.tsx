import { Form , useFetcher, useLoaderData} from "@remix-run/react";
import { FunctionComponent } from "react";
import ContactName from "~/components/ContactName";
import { ContactRecord ,getContact, updateContact} from "~/data";
import type {ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node"

import {json} from "@remix-run/node";
import invariant from "tiny-invariant";


export const loader = async ({params}: LoaderFunctionArgs) => {

  invariant(params.contactId, "Missing contactId parameter");
  
  const contact = await getContact(params.contactId);

  if(!contact) return json({contact: null}, {status: 404});

  return json({contact});
}

export const action = async ({
  params, request
}: ActionFunctionArgs)=>{
  invariant(params.contactId, "Missing contactId parameter");
  const formData = await request.formData();
  const favorite = formData.get("favorite") === "true";
  return await updateContact(params.contactId, {favorite});  
}

export default function Contact() {

  const { contact } = useLoaderData<typeof loader>() 

  if(!contact) return null

  return (
    <div id="contact">
      <div>
        <img
          src={contact.avatar}
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
        />
      </div>
      <div>
        <h1>
          <ContactName contact={contact} />
          <Favorite contact={contact} />
        </h1>
        {contact.twitter ? (
          <p>
            <a href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record"
              );

              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  const fetcher = useFetcher()
  const favorite = fetcher.formData ? fetcher.formData.get("favorite") === "true"
  : contact.favorite

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "Unfavorite" : "Favorite"}
      </button>
    </fetcher.Form>
  );
};
