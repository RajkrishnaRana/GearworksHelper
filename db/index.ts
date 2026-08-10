import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import { modelClasses } from './models';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'gearworks_db',
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses,
});
console.log('WatermelonDB initialized successfully! Models count:', modelClasses.length);

// Force database initialization and verify it works
database.get('machines').query().fetchCount().then(count => {
  console.log('WatermelonDB query success! Machines count:', count);
}).catch(err => {
  console.error('WatermelonDB query error:', err);
});

export default database;
