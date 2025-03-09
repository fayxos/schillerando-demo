import initSqlJs from 'sql.js';
import { reactive } from 'vue';

let db = null; // Singleton für die DB-Instanz

async function loadDatabase() {
    if (db) return db; // Falls bereits geladen, zurückgeben

    // Wenn du die Datenbank initialisierst
    const SQL = await initSqlJs({
        locateFile: (file) => {
            if (file === 'sql-wasm.wasm') {
                return '/sql-wasm.wasm'; // Pfad zur WASM-Datei
            }
        }
      });

    const response = await fetch('/demo.sqlite'); // Lade SQLite-Datei als ArrayBuffer
    const buffer = await response.arrayBuffer();
    db = new SQL.Database(new Uint8Array(buffer)); // Datenbank in Memory laden
    console.log('SQLite-Datenbank geladen.');

    return db;
}

// export async function await executeQuery(query, params = []) {
//     if(query.contains(";") || query.contains("'") || query.contains("\"")) return null;
//     const database = await loadDatabase(); // Stelle sicher, dass die DB geladen ist
//     return formatResult(database.exec(query, params));
// }

export async function executeQuery(query, params = []) {
    try {
        const database = await loadDatabase();

      const stmt = database.prepare(query);
      
       var results = []

      // Wenn es eine SELECT-Abfrage ist
      if (query.trim().toUpperCase().startsWith('SELECT')) {
        stmt.bind(params);
        
        while(stmt.step()) {
          const row = stmt.getAsObject();
          results.push(row);
        }
      } else {
        // Für INSERT, UPDATE, DELETE, etc.
        stmt.run(params);
      }
      
      stmt.free();
      return results;
    } catch (error) {
      console.error('Fehler bei der Ausführung der Abfrage:', error);
      return [];
    }
}

export async function getAll(table) {
    const result = await executeQuery(`SELECT * FROM ${table};`);
    return result;
}

// function formatResult(result) {
//     if (!result.length) return [];
//     const { columns, values } = result[0];
//     return values.map(row => Object.fromEntries(columns.map((col, i) => [col, row[i]])));
// }

// Reactive Datenbank-Instanz für Vue (optional)
export const dbState = reactive({
    isLoaded: false,
});

loadDatabase().then(() => {
    dbState.isLoaded = true;
});
