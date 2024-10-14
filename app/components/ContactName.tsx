import { ContactRecord } from "~/data";


export default function ContactName({ contact }: { contact: ContactRecord }) {
  return (
    <>
      {contact.first || contact.last ? (
        <>
          {contact.first} {contact.last}
        </>
      ) : (
        <i>No name</i>
      )}
    </>
  );
}