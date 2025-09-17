import { Client, Databases, Query, ID } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;


const client = new Client()
    .setEndpoint("https://nyc.cloud.appwrite.io/v1")
    .setProject(PROJECT_ID)


const database = new Databases(client)

export const updateSearchCount = async (searchItem, movie) => {
    try {
        const result = await database.listDocuments({
            databaseId: DATABASE_ID,
            collectionId: "metrics",
            queries: [Query.equal("searchItem", searchItem)]
        });

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument({
                databaseId: DATABASE_ID,
                collectionId: "metrics",
                documentId: doc.$id,
                data: { count: doc.count + 1 }
            });
        } else {
            await database.createDocument({
                databaseId: DATABASE_ID,
                collectionId: "metrics",
                documentId: ID.unique(),
                data: {
                    searchItem,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
            });
        }
    } catch (error) {
        console.error(error)
    }
}

export const getTrendingMoives = async()=>{
    try {
        const result = await database.listDocuments({
            databaseId: DATABASE_ID,
            collectionId: "metrics",
            queries: [Query.orderDesc("count"), Query.limit(5)]
        });

        return result.documents;
        
    } catch (error) {
        console.error(error)
    }
}