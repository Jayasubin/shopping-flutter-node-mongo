var { MongoClient } = require("mongodb");

main().catch(console.error);

const newContacts = [
    {
        personalInfo: {
            name: { first: "Shanmuga", last: "Priya" },
            dates: {
                birth: "20220101",
                anniversary: "20220202",
            },
        },
        contactInfo: {
            phones: {
                office: { countryCode: "+91", number: "1212121212" },
                personal: { countryCode: "+91", number: "4545454545" },
            },
            emails: {
                personal: "shanmuga.p@gmail.com",
                official: "loneWolf2022@outlook.com",
            },
        },
    },
    {
        personalInfo: {
            name: { first: "Arulanandh", last: "Kumar" },
            dates: {
                birth: "20220101",
                anniversary: "20220202",
            },
        },
        contactInfo: {
            phones: {
                office: { countryCode: "+91", number: "7878789887" },
                personal: { countryCode: "+91", number: "4585858964" },
            },
            emails: {
                personal: "Arulanandh@gmail.com",
                official: "Arulanandh@outlook.com",
            },
        },
    },
    {
        personalInfo: {
            name: { first: "John", last: "Warner" },
            dates: {
                birth: "20220101",
                anniversary: "20220202",
            },
        },
        contactInfo: {
            phones: {
                office: { countryCode: "+44", number: "4587878787" },
                personal: { countryCode: "+44", number: "8956565656" },
            },
            emails: {
                personal: "john.w@gmail.com",
                official: "john@outlook.com",
            },
        },
    },
    {
        personalInfo: {
            name: { first: "Mary", last: "Miriam" },
            dates: {
                birth: "20220101",
                anniversary: "20220202",
            },
        },
        contactInfo: {
            phones: {
                office: { countryCode: "+12", number: "2323232325" },
                personal: { countryCode: "+12", number: "5656565623" },
            },
            emails: {
                personal: "mary.m@gmail.com",
                official: "mary@outlook.com",
            },
        },
    },
    {
        personalInfo: {
            name: { first: "Vijaya", last: "Kumar" },
            dates: {
                birth: "20220101",
                anniversary: "20220202",
            },
        },
        contactInfo: {
            phones: {
                office: { countryCode: "+69", number: "2525252585" },
                personal: { countryCode: "+69", number: "9696969685" },
            },
            emails: {
                personal: "vijaya.k@gmail.com",
                official: "Vijaya@outlook.com",
            },
        },
    },
];

// MongoClient.connect("mongodb://localhost:27017", function (err, client) {
//     if (err) throw err;
//     var db = client.db("Contact_List");

//     db.collection("contacts").count(function (err, count) {
//         if (err) throw err;

//         console.log("count : " + count);
//     });
// });

async function main() {
    const client = new MongoClient("mongodb://localhost:27017");

    try {
        await client.connect();
        //console.log("Connected");

        /*await listDbs(client);

        await createContact(client, newContact);

        await createMultiple(client, newContacts);

        await findOneByName(client, "Jayasubin");

        await findManyByCode(client, "+69", 5);

        await updateOneByCode(client, "Shanmuga", {
            joinedOn: "2022-02-01T12:00:00",
        });

        await upsertByPhone(client, "4585858964", { nickName: "Pussy Cat" });

        await updateMultiple(client);

        await deleteOneByName(client, "Arulanandh");

        await deleteManyByCode(client, "+91");*/

        await findAll(client);
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
        //console.log("Closed");
    }
}

async function listDbs(client) {
    const databases = await client.db().admin().listDatabases();

    console.log("Databases :");
    databases.databases.forEach((element) => {
        console.log(`- ${element.name}`);
    });
}

async function createContact(client, newContact) {
    const result = await client
        .db("Contact_List")
        .collection("contacts")
        .insertOne(newContact);

    console.log(`Inserted as Id : ${result.insertedId}`);
}

async function createMultiple(client, newContacts) {
    const result = await client
        .db("Contact_List")
        .collection("contacts")
        .insertMany(newContacts);

    console.log(`inserted as ids : ${result.insertedIds}`);
}

async function findAll(client) {
    const cursor = await client
        .db("Contact_List")
        .collection("contacts")
        .find({});
    console.log(await cursor.count());

    const results = await cursor.toArray();

    if (results.length > 0) {
        results.forEach((res) => console.log(res));
    }
}

async function findOneByName(client, fName) {
    const result = await client
        .db("Contact_List")
        .collection("contacts")
        .findOne({ "personalInfo.name.first": fName });

    if (result) {
        console.log(`found : ${fName}`);
        console.log(result);
    } else {
        console.log(`not found : ${fName}`);
    }
}

async function findManyByCode(client, code, limit) {
    const cursor = await client
        .db("Contact_List")
        .collection("contacts")
        .find({
            "contactInfo.phones.personal.countryCode": { $eq: code },
        })
        .limit(limit);

    console.log(await cursor.count());

    const results = await cursor.toArray();

    if (results.length > 0) {
        results.forEach((res) => console.log(res));
    }
}

async function updateOneByName(client, name, update) {
    const result = await client
        .db("Contact_List")
        .collection("contacts")
        .updateOne({ "personalInfo.name.first": name }, { $set: update }, {});

    console.log(
        `${result.matchedCount} matched; ${result.modifiedCount} updated.`
    );
}

async function upsertByPhone(client, phone, update) {
    const result = await client
        .db("Contact_List")
        .collection("contacts")
        .updateOne(
            { "contactInfo.personal.number": phone },
            { $set: update },
            { upsert: true }
        );

    console.log(
        `${result.matchedCount} matched; ${result.upsertedCount} upserted; ${result.modifiedCount} updated.`
    );
}

async function updateMultiple(client, update) {
    const result = await client
        .db("Contact_List")
        .collection("contacts")
        .updateMany(
            { nickName: { $exists: false } },
            { $set: { nickName: "unknown" } }
        );

    console.log(
        `${result.matchedCount} matched; ${result.upsertedCount} upserted; ${result.modifiedCount} updated`
    );
}

async function deleteOneByName(client, name) {
    const result = await client
        .db("Contact_List")
        .collection("contacts")
        .deleteOne({ "personalInfo.name.first": name });

    console.log(`${result.deletedCount} deleted`);
}

async function deleteManyByCode(client, countryCode) {
    const result = await client
        .db("Contact_List")
        .collection("contacts")
        .deleteMany({
            "contactInfo.phones.office.countryCode": { $eq: countryCode },
        });

    console.log(`${result.deletedCount} deleted`);
}
