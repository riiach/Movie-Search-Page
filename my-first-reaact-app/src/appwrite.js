import { Client, TablesDB, Query, ID } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const database = PROJECT_ID && DATABASE_ID && TABLE_ID && ENDPOINT
    ? new TablesDB(new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID))
    : null;

export const updateSearchCount = async (searchTerm, movie) => {
    const term = searchTerm.trim().toLowerCase();
    if (!database || !term || term.length > 255 || !movie?.id) return;

    const params = { databaseId: DATABASE_ID, tableId: TABLE_ID };
    const increment = (rowId) => database.incrementRowColumn({
        ...params, rowId, column: 'count', value: 1,
    });

    try {
        const queries = [Query.equal('searchTerm', term), Query.limit(1)];
        const result = await database.listRows({ ...params, queries });
        if (result.rows.length) {
            await increment(result.rows[0].$id);
            return;
        }

        try {
            await database.createRow({
                ...params,
                rowId: ID.unique(),
                data: {
                    searchTerm: term,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : null,
                },
            });
        } catch (error) {
            // A simultaneous search may have created this unique term first.
            if (error.code !== 409) throw error;
            const existing = await database.listRows({ ...params, queries });
            if (!existing.rows.length) throw error;
            await increment(existing.rows[0].$id);
        }
    } catch (error) {
        // Tracking must never prevent movie results from being displayed.
        console.error('Error updating search count:', error);
    }
};
