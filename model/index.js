const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  return await JSON.parse(await fs.readFile(contactsPath));
};

const getContactById = async (contactId) => {
  const contactsArray = await listContacts();
  const contact = contactsArray.find((contact) => contact.id === contactId);
  if (!contact) {
    return null;
  }
  return contact;
};

const removeContact = async (contactId) => {
  const contactsArray = await listContacts();

  const index = contactsArray.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const deletedContact = contactsArray.splice(index, 1)[0];
  const clerearedContacts = contactsArray;

  await fs.writeFile(contactsPath, JSON.stringify(clerearedContacts, null, 2));

  return deletedContact;
};

const addContact = async (body) => {
  const newContact = { ...body, id: v4() };
  const contactsArray = await listContacts();
  contactsArray.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contactsArray, null, 2));

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contactsArray = await listContacts();
  const index = contactsArray.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const updatedContact = { ...body, id: contactId };
  contactsArray[index] = updatedContact;

  await fs.writeFile(contactsPath, JSON.stringify(contactsArray, null, 2));

  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
