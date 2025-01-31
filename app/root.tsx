import {
  Form,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
  useLoaderData,
  redirect,
  NavLink,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import { json } from "@remix-run/node";
import { ContactRecord, createEmptyContact, getContacts } from "./data";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import appStylesHef from "./app.css?url";
import ContactName from "./components/ContactName";
import { useEffect, useState } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHef },
];


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const q = url.searchParams.get("q")
  const contacts = await getContacts(q);
  return json({ contacts, q });
};

export const action = async () => {
  const contact = await createEmptyContact()
  
  return redirect(`/contacts/${contact.id}/edit`);
}

export default function App() {
  const { contacts, q } = useLoaderData<typeof loader>();
  const [query, setQuery] = useState(q || "");

  const navigation = useNavigation()
  const submit = useSubmit()

    const searching =
      navigation.location &&
      new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    setQuery(q || "")
  }, [q])
  

  return (  
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search"
              onSubmit={(e)=>{
                const isFirstSearch = q === null
                submit(e.currentTarget, {
                  replace: !isFirstSearch
                })
              }}
            >
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                defaultValue={query}
                onChange={(e) => {
                  setQuery(e.currentTarget.value)
                }}
                className={searching ? "loading" : ""}
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact: ContactRecord) => (
                  <li key={contact.id}>
                    <NavLink
                      // load the data like pending
                      className={({ isActive, isPending }) =>
                        isActive ? "active" : isPending ? "pending" : ""
                      }
                      to={`contacts/${contact.id}`}
                    >
                      <ContactName contact={contact} />
                      {contact.favorite ? (
                        <span>
                          <span aria-label="Favorite" role="img">
                            ⭐️
                          </span>
                        </span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No contacts found</p>
            )}
          </nav>
        </div>
        <div
          className={navigation.state === "loading" && !searching ? "loading" : ""}
          id="detail"
        >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
